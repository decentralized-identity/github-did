const A = require("./A");
const B = require("./B");

const resolver = {
  resolve: did => {
    if (did === A.did.id) {
      return A.did;
    }

    if (did === B.did.id) {
      return B.did;
    }
  }
};

module.exports = {
  A,
  B,
  resolver
};
