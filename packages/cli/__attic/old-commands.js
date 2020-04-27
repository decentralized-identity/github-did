

vorpal
.command('init <password> [forkedRepoUrl]', 'initialize github-did')
.action(async ({ password, forkedRepoUrl }) => {
  // If no forked repo url is specified, default to the Transmute one
  const repoUrl = forkedRepoUrl || packageJson.repository.url;
  if (vorpal.config) {
    logger.log({
      level: 'info',
      message: `Config exists ${configPath}`,
    });
  } else {
    // Clone the github-did repo from the specified url
    const [user, repo] = repoUrl
      .split(/github.com./)[1]
      .split('.git')[0]
      .split('/');
    const gitUrl = `git@github.com:${user}/${repo}.git`;
    const cwd = process.cwd();
    const repoPath = path.resolve(os.homedir(), '.github-did', repo);
    const cmd = `
      if cd ${repoPath}; then git pull; else git clone ${gitUrl} ${repoPath}; fi
      cd ${cwd};
    `;
    const silentState = shell.config.silent;
    shell.config.silent = true;
    shell.exec(cmd);
    shell.config.silent = silentState; // restore old silent state

    // Create an empty wallet
    const wallet = await ghdid.createWallet();
    await wallet.encrypt(password);

    await fse.outputFile(walletFilePath, JSON.stringify(wallet.data, null, 2));

    await fse.outputFile(
      configPath,
      JSON.stringify(
        {
          name: 'github-did-config',
          version,
          wallet: walletFilePath,
          logs: logPath,
          repoUrl,
        },
        null,
        2,
      ),
    );
    await vorpal.logger.log({
      level: 'info',
      message: `Config created ${configPath}`,
    });
  }
  return vorpal.wait(1);
});

vorpal
.command('addKey <password> [tag]', 'add a key to your wallet')
.action(async ({ password, tag }) => {
  // eslint-disable-next-line
  tag = tag || 'main';
  if (!vorpal.config) {
    logger.log({
      level: 'info',
      message: 'You should init your wallet first',
    });
  } else {
    const encryptedWalletData = JSON.parse(fse.readFileSync(walletFilePath).toString());
    const wallet = new ghdid.TransmuteDIDWallet(encryptedWalletData);
    await wallet.decrypt(password);
    const kid = await ghdid.addKeyWithTag({
      wallet,
      passphrase: password,
      tag,
    });

    const { repoUrl } = vorpal.config;
    const [user, repo] = repoUrl
      .split(/github.com./)[1]
      .split('.git')[0]
      .split('/');
    const did = ghdid.createDID('ghdid', user, repo, kid);

    const didDocument = await wallet.toDIDDocumentByTag({
      did,
      tag,
    });

    const signedDIDDocument = await ghdid.sign({
      data: didDocument.data,
      creator: ghdid.constructDIDPublicKeyID(didDocument.data.id, kid),
      privateKey: await ghdid.getUnlockedPrivateKey(
        wallet.data.keystore[kid].data.privateKey,
        password,
      ),
    });

    // Update DID Document
    await fse.outputFile(
      path.resolve(os.homedir(), '.github-did', repo, 'dids', `${kid}.jsonld`),
      JSON.stringify(
        {
          ...signedDIDDocument,
        },
        null,
        2,
      ),
    );
    logger.log({
      level: 'info',
      message: `Created did document for ${did}`,
    });

    const kidsByTag = Object.values(wallet.data.keystore)
      .filter(key => key.meta.tags.includes(tag))
      .map(key => key.kid);
    await wallet.encrypt(password);

    // Update wallet
    await fse.outputFile(walletFilePath, JSON.stringify(wallet.data, null, 2));
    logger.log({
      level: 'info',
      message: `Keys for tag "${tag}" stored in the wallet are\n${kidsByTag.map(k => `${k}\n`)}`,
    });
  }
  return vorpal.wait(1);
});

vorpal.command('resolve <did>', 'resolve a ghdid').action(async ({ did }) => {
const didDocument = await ghdid.resolver.resolve(did);
console.log(JSON.stringify(didDocument, null, 2));
await vorpal.logger.log({
  level: 'info',
  message: `did resolved ${did}`,
});
const verified = await ghdid.verify({
  data: didDocument,
});

await vorpal.logger.log({
  level: 'info',
  message: `did verification ${verified} ${did}`,
});
return vorpal.wait(1);
});

vorpal
.command(
  'sendMessageOnSlack <password> <didFrom> <didTo> <message>',
  'send an encrypted message on Slack',
)
.action(async ({
  password, didFrom, didTo, message,
}) => {
  // Recover the wallet and get my private key
  const encryptedWalletData = JSON.parse(fse.readFileSync(walletFilePath).toString());
  const wallet = new ghdid.TransmuteDIDWallet(encryptedWalletData);
  await wallet.decrypt(password);
  const primaryKid = didFrom.split('~').pop();
  const { privateKey } = wallet.data.keystore[primaryKid].data;
  const privateKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privateKeyObj.decrypt(password);

  // Get public key of didTo
  const didDocumentTo = await ghdid.resolver.resolve(didTo);
  const publicKey = didDocumentTo.publicKey[0].publicKeyPem;
  const publicKeyObj = (await openpgp.key.readArmored(publicKey)).keys[0];

  // Create encrypted message
  const encryptedMessage = (await openpgp.encrypt({
    message: openpgp.message.fromText(message),
    publicKeys: [publicKeyObj],
    privateKeys: [privateKeyObj],
  })).data;

  // Send message on Slack
  const body = {
    type: 'github-did message',
    didFrom,
    didTo,
    message: encryptedMessage,
  };
  const text = `\`\`\`${JSON.stringify(body, null, 2)}\`\`\``;
  const webhook = process.env.SLACK_HOOK;
  await fetch(webhook, {
    method: 'post',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' },
  });

  return vorpal.wait(1);
});

vorpal
.command('decrypt <password> <payloadPath>', 'send an encrypted message on Slack')
.action(async ({ password, payloadPath }) => {
  const out = path.resolve(payloadPath);
  const json = JSON.parse(fse.readFileSync(out));
  const { didFrom, didTo, message } = json;

  // Get public key of sender
  const didDocumentFrom = await ghdid.resolver.resolve(didFrom);
  const publicKey = didDocumentFrom.publicKey[0].publicKeyPem;
  const publicKeyObj = (await openpgp.key.readArmored(publicKey)).keys[0];

  // Get wallet of recipient
  const encryptedWalletData = JSON.parse(fse.readFileSync(walletFilePath).toString());
  const wallet = new ghdid.TransmuteDIDWallet(encryptedWalletData);
  await wallet.decrypt(password);

  // Get private key of recipient
  const kid = didTo.split('~github-did~')[1];
  const { privateKey } = wallet.data.keystore[kid].data;
  const privateKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privateKeyObj.decrypt(password);

  const decryptedMessage = (await openpgp.decrypt({
    // TODO: ciphertext instead of message?
    message: await openpgp.message.readArmored(message), // parse armored message
    publicKeys: publicKeyObj,
    privateKeys: privateKeyObj,
  })).data;
  // eslint-disable-next-line
  console.log(`🙈 ${decryptedMessage}`);

  return vorpal.wait(1);
});
