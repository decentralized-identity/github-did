const getPublicKeyFromDIDDoc = require("./getPublicKeyFromDIDDoc");
const OpenPgpSignature2019 = require("@transmute/openpgpsignature2019");
const wrappedDocumentLoader = require("./wrappedDocumentLoader");

const jsigs = require("jsonld-signatures");
const { Ed25519Signature2018 } = jsigs.suites;
const { AssertionProofPurpose } = jsigs.purposes;
const { Ed25519KeyPair } = require("crypto-ld");

const verifyWithResolver = async (signedData, resolver) => {
  const verificationMethod = signedData.proof.verificationMethod
    ? signedData.proof.verificationMethod
    : signedData.proof.creator;
  const doc = await resolver.resolve(verificationMethod);

  const didPublicKey = doc.publicKey.find(k => {
    return k.id == verificationMethod;
  });

  if (didPublicKey.type === "Ed25519VerificationKey2018") {
    const result = await jsigs.verify(signedData, {
      documentLoader: wrappedDocumentLoader({
        //args that are needed in the wrapper.. such as zcaps
      }),
      suite: new Ed25519Signature2018({
        key: new Ed25519KeyPair(didPublicKey)
      }),
      purpose: new AssertionProofPurpose({ controller: doc })
    });

    return result.verified;
  }

  return OpenPgpSignature2019.verify({
    data: signedData,
    signatureAttribute: "proof",
    publicKey: getPublicKeyFromDIDDoc(doc, verificationMethod)
  });
};

module.exports = verifyWithResolver;
