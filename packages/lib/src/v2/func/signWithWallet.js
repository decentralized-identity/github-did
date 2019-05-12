const openpgp = require("openpgp");
const OpenPgpSignature2019 = require("@transmute/openpgpsignature2019");

const createPublicKeyIDFromDIDAndKey = require("./createPublicKeyIDFromDIDAndKey");

const signWithWallet = async (data, did, kid, wallet) => {
  return OpenPgpSignature2019.sign({
    data,
    domain: "GitHubDID",
    signatureAttribute: "proof",
    creator: createPublicKeyIDFromDIDAndKey(did, wallet.keys[kid]),
    privateKey: (await openpgp.key.readArmored(wallet.keys[kid].privateKey))
      .keys[0]
  });
};

module.exports = signWithWallet;
