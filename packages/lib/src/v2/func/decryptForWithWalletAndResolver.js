const openpgp = require("openpgp");

const getPublicKeyFromDIDDoc = require("./getPublicKeyFromDIDDoc");

const decryptForWithWalletAndResolver = async ({
  data,
  fromPublicKeyId,
  toPublicKeyId,
  wallet,
  resolver
}) => {
  const fromDidDoc = await resolver.resolve(fromPublicKeyId);
  const publicKey = getPublicKeyFromDIDDoc(fromDidDoc, fromPublicKeyId);
  const toKid = toPublicKeyId.split("#").pop();
  const privateKey = (
    await openpgp.key.readArmored(wallet.keys[toKid].privateKey)
  ).keys[0];

  const options = {
    message: await openpgp.message.readArmored(data), // parse armored message
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for verification (optional)
    privateKeys: [privateKey] // for decryption
  };

  const plainText = await openpgp
    .decrypt(options)
    .then(plaintext => plaintext.data);

  return JSON.parse(plainText);
};

module.exports = decryptForWithWalletAndResolver;
