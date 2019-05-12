const getPublicKeyFromDIDDoc = require("./getPublicKeyFromDIDDoc");
const OpenPgpSignature2019 = require("@transmute/openpgpsignature2019");

const verifyWithResolver = async (signedData, resolver) => {
  const doc = await resolver.resolve(signedData.proof.creator);
  const publicKey = getPublicKeyFromDIDDoc(doc, signedData.proof.creator);
  return OpenPgpSignature2019.verify({
    data: signedData,
    signatureAttribute: "proof",
    publicKey
  });
};

module.exports = verifyWithResolver;
