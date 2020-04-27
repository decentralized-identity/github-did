const openpgp = require("openpgp");

const getPublicKeyFromDIDDoc = require("./getPublicKeyFromDIDDoc");

const encryptForWithWalletAndResolver = async ({
  data,
  fromPublicKeyId,
  toPublicKeyId,
  wallet,
  resolver
}) => {
  const message = JSON.stringify(data);

  const toDidDoc = await resolver.resolve(toPublicKeyId);
  const publicKey = getPublicKeyFromDIDDoc(toDidDoc, toPublicKeyId);
  const fromKid = fromPublicKeyId.split("#").pop();
  const privateKey = (
    await openpgp.key.readArmored(wallet.keys[fromKid].privateKey)
  ).keys[0];

  const options = {
    message: openpgp.message.fromText(message), // input as String (or Uint8Array)
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for encryption
    privateKeys: [privateKey] // for signing (optional)
  };

  const cipherText = await openpgp.encrypt(options).then(ciphertext => {
    const encrypted = ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
    return encrypted;
  });

  return {
    fromPublicKeyId,
    toPublicKeyId,
    cipherText
  };
};

module.exports = encryptForWithWalletAndResolver;
