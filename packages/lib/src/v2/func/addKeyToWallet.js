const createWallet = require("./createWallet");
module.exports = (wallet, key) => {
  wallet.addKey(key);
  return createWallet({
    keys: Object.values(wallet.keys)
  });
};
