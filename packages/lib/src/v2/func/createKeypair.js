const openpgp = require("openpgp");

module.exports = async options => {
  const key = await openpgp.generateKey(options);
  return key;
};
