const createKeypair = require("./createKeypair");
const createWallet = require("./createWallet");
const addKeyToWallet = require("./addKeyToWallet");
const createDIDDocFromWallet = require("./createDIDDocFromWallet");
const resolver = require("./resolver");
const verifyWithResolver = require("./verifyWithResolver");
const signWithWallet = require("./signWithWallet");
const encryptForWithWalletAndResolver = require("./encryptForWithWalletAndResolver");
const decryptForWithWalletAndResolver = require("./decryptForWithWalletAndResolver");

module.exports = {
  createKeypair,
  createWallet,
  addKeyToWallet,
  createDIDDocFromWallet,
  resolver,
  verifyWithResolver,
  signWithWallet,
  encryptForWithWalletAndResolver,
  decryptForWithWalletAndResolver
};
