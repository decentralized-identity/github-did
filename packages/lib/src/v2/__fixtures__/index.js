const fs = require("fs");
const path = require("path");

const public_key = fs.readFileSync(path.resolve(__dirname, "./public.pem"));
const private_key = fs.readFileSync(path.resolve(__dirname, "./private.pem"));

const encryptedWallet = fs
  .readFileSync(path.resolve(__dirname, "./wallet.txt"))
  .toString();

const signedJson = require("./signedJson.json");

const encryptedMessageFor = require("./encryptedMessageFor.json");

module.exports = {
  encryptedWallet,
  signedJson,
  encryptedMessageFor,
  public_key,
  private_key
};
