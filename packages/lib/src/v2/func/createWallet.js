const wallet = require("@transmute/did-wallet");

module.exports = (keys) => {
  return wallet.create(keys);
};
