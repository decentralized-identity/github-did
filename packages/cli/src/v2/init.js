const os = require('os');
const path = require('path');
const shell = require('shelljs');
const fse = require('fs-extra');

const ghdid = require('@github-did/lib');

module.exports = (vorpal) => {
  const {
    logger, packageJson, configPath, walletFilePath, webWalletFilePath, logPath,
  } = vorpal;
  const { version } = packageJson;
  vorpal
    .command('init <password> [targetRepo]', 'initialize github-did')
    .option('-f, --force', 'Force init, overwriting existing data.')
    .action(async ({ password, targetRepo, options }) => {
      // console.log(options);
      // If no forked repo url is specified, default to the Transmute one
      const repoUrl = targetRepo || packageJson.repository.url;
      if (vorpal.config && !options.force) {
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
        let cmd = `
        if cd ${repoPath}; then git pull; else git clone ${gitUrl} ${repoPath}; fi
        cd ${cwd};
      `;
        const silentState = shell.config.silent;
        shell.config.silent = true;
        shell.exec(cmd);
        shell.config.silent = silentState; // restore old silent state

        let wallet = ghdid.createWallet();

        const key1 = await ghdid.createKeypair({
          userIds: [{ name: 'anon', email: 'anon@example.com' }],
          curve: 'secp256k1',
        });

        const key2 = await ghdid.createKeypair({
          userIds: [{ name: 'anon', email: 'anon@example.com' }],
          curve: 'secp256k1',
        });

        wallet = ghdid.addKeyToWallet(wallet, {
          type: 'assymetric',
          encoding: 'application/pgp-keys',
          publicKey: key1.publicKeyArmored,
          privateKey: key1.privateKeyArmored,
          revocationCertificate: key1.revocationCertificate,
          tags: ['Secp256k1VerificationKey2018', `did:github:${user}`, 'OpenPGP'],
          notes: 'Created with github-did cli.',
        });

        wallet = ghdid.addKeyToWallet(wallet, {
          type: 'assymetric',
          encoding: 'application/pgp-keys',
          publicKey: key2.publicKeyArmored,
          privateKey: key2.privateKeyArmored,
          revocationCertificate: key2.revocationCertificate,
          tags: ['Secp256k1VerificationKey2018', `did:github:${user}`, 'OpenPGP', 'web'],
          notes: 'Created with github-did cli.',
        });

        const rootDIDPath = path.resolve(repoPath, 'index.jsonld');

        if (!fse.existsSync(rootDIDPath) || options.force) {
          const kid = Object.keys(wallet.keys)[0];
          const doc = await ghdid.createDIDDocFromWallet(wallet, {
            signWithKID: kid,
            includeKeysWithTags: [`did:github:${user}`],
            id: `did:github:${user}`,
            publicKey: [],
            service: [],
            authentication: [],
          });
          await fse.outputFile(rootDIDPath, JSON.stringify(doc, null, 2));
          cmd = `
            cd ${repoPath};
            echo '# [did:github:${user}](https://raw.githubusercontent.com/${user}/ghdid/master/index.jsonld)' > README.md
            git add README.md ./index.jsonld;
            git commit -m "Create and publish did:github:${user} with github-did cli."
            git push origin master;
            cd ${cwd};
          `;
          shell.config.silent = true;
          shell.exec(cmd);
          shell.config.silent = silentState; // restore old silent state
          await vorpal.logger.log({
            level: 'info',
            message: `Create and publish did:github:${user} with github-did cli.`,
          });
        } else {
          await vorpal.logger.log({
            level: 'info',
            message: `did:github:${user} already exists. Overwrite it with --force.`,
          });
        }

        const webKeys = wallet.extractByTags(['web']);
        const webWallet = ghdid.createWallet({ keys: webKeys });

        webWallet.lock(password);
        const webWalletExport = webWallet.export();

        wallet.lock(password);
        const exportedWallet = wallet.export();

        await fse.outputFile(walletFilePath, exportedWallet);
        await fse.outputFile(webWalletFilePath, webWalletExport);
        await fse.outputFile(
          configPath,
          JSON.stringify(
            {
              name: 'github-did-config',
              version,
              wallet: walletFilePath,
              webWallet: webWalletFilePath,
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
};
