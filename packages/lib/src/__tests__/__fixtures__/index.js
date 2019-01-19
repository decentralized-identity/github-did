const { TransmuteDIDWallet } = require("@transmute/transmute-did");

const didMethod = "ghdid";
const email = "alice@example.com";
const passphrase = "correct horse battery staple";
const walletData = require("./walletData.json");
const didDocument = require("./didDocument.json");
const didDocumentWithProof = require("./didDocumentWithProof.json");

const ocap = require("./ocap");

module.exports = {
  didMethod,
  email,
  passphrase,
  wallet: new TransmuteDIDWallet(walletData),
  didDocument,
  didDocumentWithProof,
  ocap
};
