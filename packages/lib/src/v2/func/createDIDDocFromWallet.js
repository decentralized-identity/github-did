const signWithWallet = require("./signWithWallet");

const createDIDDoc = require("./createDIDDoc");

module.exports = async (wallet, options) => {
  let doc = await createDIDDoc(wallet, options);

  if (options.signWithKID) {
    doc = signWithWallet(doc, options.id, options.signWithKID, wallet);
  }

  return doc;
};
