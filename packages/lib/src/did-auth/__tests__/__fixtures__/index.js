const fs = require("fs");
const path = require("path");

const public_key = fs.readFileSync(path.resolve(__dirname, "./public.pem"));
const private_key = fs.readFileSync(path.resolve(__dirname, "./private.pem"));
module.exports = {
  public_key,
  private_key
};
