const shell = require('shelljs');

module.exports = (vorpal) => {
  const { webWalletFilePath } = vorpal;

  vorpal
    .command('exportWebWallet <targetFilePath>', 'export your github-did web wallet')

    .action(async ({ targetFilePath, options }) => {
      if (vorpal.config && !options.force) {
        const silentState = shell.config.silent;
        const cmd = `
            cp ${webWalletFilePath} ${targetFilePath};
       
          `;
        shell.config.silent = true;
        shell.exec(cmd);
        shell.config.silent = silentState; // restore old silent state

        await vorpal.logger.log({
          level: 'info',
          message: `Exported encrypted wallet ${targetFilePath}`,
        });
      } else {
        await vorpal.logger.log({
          level: 'info',
          message: 'Cannot export, must run init first.',
        });
      }
      return vorpal.wait(1);
    });
};
