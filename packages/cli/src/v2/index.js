const init = require('./init');
const resolve = require('./resolve');
const verify = require('./verify');
const sign = require('./sign');
const encrypt = require('./encrypt');
const decrypt = require('./decrypt');

const commands = {
  init,
  resolve,
  verify,
  sign,
  encrypt,
  decrypt,
};

const register = (vorpal) => {
  Object.keys(commands).map(command => commands[command](vorpal));
};

module.exports = {
  ...commands,
  register,
};
