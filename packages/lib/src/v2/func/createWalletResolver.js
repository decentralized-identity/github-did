const createDIDDocFromWallet = require("./createDIDDocFromWallet");

const createWalletResolver = wallet => {
  return {
    resolve: did => {
      const cleanDID = did.split("#").shift();
      return createDIDDocFromWallet(wallet, {
        includeKeysWithTags: [cleanDID],
        id: cleanDID
      });
    }
  };
};

module.exports = createWalletResolver;
