const ghdid = require('@github-did/lib');

module.exports = (vorpal) => {
  vorpal.command('resolve <did>', 'resolve a github-did').action(async ({ did }) => {
    const didDocument = await ghdid.resolver.resolve(did);
    // eslint-disable-next-line
    console.log(JSON.stringify(didDocument, null, 2));
    await vorpal.logger.log({
      level: 'info',
      message: `${did} is resolved`,
    });

    const verified = await ghdid.verifyWithResolver(didDocument, ghdid.resolver);

    await vorpal.logger.log({
      level: 'info',
      message: `${did} ${verified ? 'proof is valid' : 'proof is not valid'} `,
    });

    return vorpal.wait(1);
  });
};
