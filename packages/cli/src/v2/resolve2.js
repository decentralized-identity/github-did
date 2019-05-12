const ghdid = require('@github-did/lib');

module.exports = (vorpal) => {
  vorpal.command('resolve2 <did>', 'resolve a github-did').action(async ({ did }) => {
    const didDocument = await ghdid.v2.func.resolver.resolve(did);
    // eslint-disable-next-line
    console.log(JSON.stringify(didDocument, null, 2));
    await vorpal.logger.log({
      level: 'info',
      message: `${did} is resolved`,
    });

    const verified = await ghdid.v2.func.verifyWithResolver(didDocument, ghdid.v2.func.resolver);

    await vorpal.logger.log({
      level: 'info',
      message: `${did} ${verified ? 'proof is valid' : 'proof is not valid'} `,
    });

    return vorpal.wait(1);
  });
};
