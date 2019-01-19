#!/usr/bin/env node
const os = require("os");
const path = require("path");
const fse = require("fs-extra");
const vorpal = require("vorpal")();
const shell = require("shelljs");
const ghdid = require("@github-did/lib");
const logger = require("./logger");
vorpal.logger = logger;

vorpal.wait = seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const { version, repository } = require("../package.json");

const logPath = path.resolve(os.homedir(), ".github-did", "log.json");

const configPath = path.resolve(os.homedir(), ".github-did", "config.json");

if (fse.existsSync(configPath)) {
  vorpal.config = require(configPath);
}

const [user, repo] = repository.url
  .split("+")[1]
  .split("https://github.com/")[1]
  .split(".")[0]
  .split("/");

vorpal
  .command("init <email> <password>", "initialize github-did")
  .action(async ({ email, password }) => {
    if (vorpal.config) {
      logger.log({
        level: "info",
        message: `Config exists ${configPath}`
      });
    } else {
      const cwd = process.cwd();
      const repoUrl = `git@github.com:${user}/${repo}.git`;
      const repoPath = path.resolve(os.homedir(), ".github-did", repo);
      const cmd = `
    if cd ${repoPath}; then git pull; else git clone ${repoUrl} ${repoPath}; fi
    cd ${cwd};
    `;
      const silentState = shell.config.silent;
      shell.config.silent = true;

      shell.exec(cmd, (code, stdout, stderr) => {
        // console.log("Exit code:", code);
        // console.log("Program output:", stdout);
        // console.log("Program stderr:", stderr);
      });
      shell.config.silent = silentState; // restore old silent state

      const walletFilePath = path.resolve(
        os.homedir(),
        ".github-did",
        "wallet.json"
      );

      const wallet = await ghdid.createDIDWallet({
        email: email,
        password: password
      });

      const kid = Object.keys(wallet.data.keystore)[0];

      const didDocument = await wallet.toDIDDocument({
        did: ghdid.createDID("ghdid", user, repo, kid),
        cacheLocal: true
      });

      const signedDIDDocument = await ghdid.sign({
        data: didDocument.data,
        creator: ghdid.constructDIDPublicKeyID(didDocument.data.id, kid),
        privateKey: await ghdid.getUnlockedPrivateKey(
          wallet.data.keystore[kid].data.privateKey,
          password
        )
      });

      await fse.outputFile(
        path.resolve(
          os.homedir(),
          ".github-did",
          repo,
          "dids",
          `${kid}.jsonld`
        ),
        JSON.stringify(
          {
            ...signedDIDDocument
          },
          null,
          2
        )
      );

      await wallet.encrypt(password);

      await fse.outputFile(
        walletFilePath,
        JSON.stringify(wallet.data, null, 2)
      );

      await fse.outputFile(
        configPath,
        JSON.stringify(
          {
            name: "github-did-config",
            email: email,
            version,
            wallet: walletFilePath,
            logs: logPath
          },
          null,
          2
        )
      );
      await vorpal.logger.log({
        level: "info",
        message: `Config created ${configPath}`
      });
    }
    return vorpal.wait(1);
  });

vorpal.command("resolve <did>", "resolve a ghdid").action(async ({ did }) => {
  const didDocument = await ghdid.resolver.resolve(did);
  console.log(JSON.stringify(didDocument, null, 2));
  await vorpal.logger.log({
    level: "info",
    message: `did resolved ${did}`
  });
  const verified = await ghdid.verify({
    data: didDocument
  });

  await vorpal.logger.log({
    level: "info",
    message: `did verification ${verified} ${did}`
  });
  return vorpal.wait(1);
});

vorpal.command("version", "display github-did version").action(async args => {
  await vorpal.logger.log({
    level: "info",
    message: `version ${version}`
  });
  return vorpal.wait(1);
});

vorpal.command("logs", "display logs").action(async args => {
  const logs = fse
    .readFileSync(vorpal.config.logs)
    .toString()
    .split("\n")
    .filter(defined => {
      return defined;
    })
    .map(logLine => {
      if (logLine) {
        return JSON.parse(logLine);
      }
    });
  console.log(JSON.stringify(logs, null, 2));
  return vorpal.wait(1);
});

vorpal.parse(process.argv);
if (process.argv.length == 0) {
  vorpal.delimiter("🐙 ").show();
}
