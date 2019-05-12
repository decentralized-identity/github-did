const fs = require("fs");
const path = require("path");

const encryptedWallet = fs
  .readFileSync(path.resolve(__dirname, "./wallet.txt"))
  .toString();

const signedJson = require("./signedJson.json");

const encryptedMessageFor = require("./encryptedMessageFor.json");

module.exports = {
  encryptedWallet,
  signedJson,
  encryptedMessageFor
};
