const openpgp = require("openpgp");
const OpenPgpSignature2019 = require("@transmute/openpgpsignature2019");
const { Ed25519KeyPair } = require("crypto-ld");
const jsigs = require("jsonld-signatures");
const { Ed25519Signature2018 } = jsigs.suites;
const { AssertionProofPurpose } = jsigs.purposes;

const createPublicKeyIDFromDIDAndKey = require("./createPublicKeyIDFromDIDAndKey");

const wrappedDocumentLoader = require("./wrappedDocumentLoader");

const signWithWallet = async (data, did, kid, wallet) => {
  // console.log(wallet.keys[kid]);
  if (wallet.keys[kid].encoding === "base58") {
    // console.log(wallet.keys[kid].publicKey);

    // console.log(data);

    const publicKeyId = createPublicKeyIDFromDIDAndKey(did, wallet.keys[kid]);
    const publicKey = {
      "@context": jsigs.SECURITY_CONTEXT_URL,
      type: "Ed25519VerificationKey2018",
      id: publicKeyId,
      controller: did,
      publicKeyBase58: wallet.keys[kid].publicKey
    };

    // DID does not exist yet
    const controller = {
      "@context": jsigs.SECURITY_CONTEXT_URL,
      id: did,
      publicKey: [publicKey],
      // this authorizes this key to be used for making assertions
      assertionMethod: [publicKey.id]
    };

    const signed = await jsigs.sign(data, {
      documentLoader: wrappedDocumentLoader({
        //args that are needed in the wrapper.. such as zcaps
      }),
      suite: new Ed25519Signature2018({
        verificationMethod: publicKeyId,
        key: new Ed25519KeyPair({
          privateKeyBase58: wallet.keys[kid].privateKey,
          publicKeyBase58: wallet.keys[kid].publicKey
        })
      }),
      purpose: new AssertionProofPurpose({ controller }),
      compactProof: false
    });

    return signed;
  } else {
    return OpenPgpSignature2019.sign({
      data,
      domain: "GitHubDID",
      signatureAttribute: "proof",
      creator: createPublicKeyIDFromDIDAndKey(did, wallet.keys[kid]),
      privateKey: (await openpgp.key.readArmored(wallet.keys[kid].privateKey))
        .keys[0]
    });
  }
};

module.exports = signWithWallet;
