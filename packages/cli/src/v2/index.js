const init = require('./init');
const resolve = require('./resolve');
const verify = require('./verify');
const sign = require('./sign');
const encrypt = require('./encrypt');
const decrypt = require('./decrypt');
const exportWebWallet = require('./exportWebWallet');

const commands = {
  init,
  resolve,
  verify,
  sign,
  encrypt,
  decrypt,
  exportWebWallet,
};

const register = (vorpal) => {
  Object.keys(commands).map(command => commands[command](vorpal));
};

module.exports = {
  ...commands,
  register,
};
