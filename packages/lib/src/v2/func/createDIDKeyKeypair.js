const { Ed25519KeyPair } = require("crypto-ld");
const didMethodKey = require("did-method-key");
const { keyToDidDoc } = didMethodKey.driver();
module.exports = async () => {
  const edKey = await Ed25519KeyPair.generate();
  const doc = keyToDidDoc(edKey);
  return { ...edKey, didDocument: doc };
};
