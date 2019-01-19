const { TransmuteDIDWallet } = require("@transmute/transmute-did");

module.exports = {
  alice: {
    didDocument: require("./alice/didDocument.json"),
    wallet: new TransmuteDIDWallet(require("./alice/wallet.json"))
  },
  bob: {
    didDocument: require("./bob/didDocument.json"),
    wallet: new TransmuteDIDWallet(require("./bob/wallet.json"))
  },
  server: {
    didDocument: require("./server/didDocument.json"),
    wallet: new TransmuteDIDWallet(require("./server/wallet.json"))
  }
};
