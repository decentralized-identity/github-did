#!/usr/bin/env node
const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const vorpal = require('vorpal')();

const logger = require('./logger');
const packageJson = require('../package.json');

const v2 = require('./v2');

const { version } = packageJson;
const logPath = path.resolve(os.homedir(), '.github-did', 'log.json');
const configPath = path.resolve(os.homedir(), '.github-did', 'config.json');
const walletFilePath = path.resolve(os.homedir(), '.github-did', 'wallet.enc');
const webWalletFilePath = path.resolve(os.homedir(), '.github-did', 'web.wallet.enc');

if (fse.existsSync(configPath)) {
  // eslint-disable-next-line
  vorpal.config = require(configPath);
}

vorpal.packageJson = packageJson;
vorpal.configPath = configPath;
vorpal.logPath = logPath;
vorpal.walletFilePath = walletFilePath;
vorpal.webWalletFilePath = webWalletFilePath;
vorpal.logger = logger;
vorpal.wait = seconds => new Promise((resolve) => {
  setTimeout(resolve, seconds * 1000);
});

vorpal.command('version', 'display github-did version').action(async () => {
  await vorpal.logger.log({
    level: 'info',
    message: `version ${version}`,
  });
  // eslint-disable-next-line
  console.log(
    JSON.stringify(
      {
        '@github-did/cli': version,
        '@github-did/lib': packageJson.dependencies['@github-did/lib'],
        '@transmute/openpgpsignature2019':
          packageJson.dependencies['@transmute/openpgpsignature2019'],
      },
      null,
      2,
    ),
  );
  return vorpal.wait(1);
});

vorpal.command('logs', 'display logs').action(async () => {
  const logs = fse
    .readFileSync(vorpal.config.logs)
    .toString()
    .split('\n')
    .filter(defined => defined)
    .map((logLine) => {
      if (logLine) {
        return JSON.parse(logLine);
      }
      return '';
    });
  // eslint-disable-next-line
  console.log(JSON.stringify(logs, null, 2));
  return vorpal.wait(1);
});

v2.register(vorpal);

vorpal.parse(process.argv);
if (process.argv.length === 0) {
  vorpal.delimiter('🐙 ').show();
}
