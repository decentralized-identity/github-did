const fs = require("fs");
const path = require("path");

const public_key = fs
  .readFileSync(path.resolve(__dirname, "./public.pem"))
  .toString();
const private_key = fs
  .readFileSync(path.resolve(__dirname, "./private.pem"))
  .toString();

module.exports = {
  public_key,
  private_key,
};
