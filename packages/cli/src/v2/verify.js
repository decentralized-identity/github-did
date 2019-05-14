const ghdid = require('@github-did/lib');
const fse = require('fs-extra');
const path = require('path');

module.exports = (vorpal) => {
  vorpal.command('verify <pathToFile>', 'verify signed JSON-LD').action(async ({ pathToFile }) => {
    const payload = JSON.parse(fse.readFileSync(path.resolve(pathToFile)));
    const verified = await ghdid.verifyWithResolver(payload, ghdid.resolver);
    await vorpal.logger.log({
      level: 'info',
      message: `${pathToFile} ${verified ? 'proof is valid' : 'proof is not valid'} `,
    });
    return vorpal.wait(1);
  });
};
