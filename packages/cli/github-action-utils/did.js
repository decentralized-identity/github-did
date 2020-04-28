const ghdid = require('@github-did/lib');
const fs = require('fs')
const jsigs = require("jsonld-signatures");
const { Ed25519Signature2018 } = jsigs.suites;
const { AssertionProofPurpose } = jsigs.purposes;
const { Ed25519KeyPair } = require("crypto-ld");
const jsonld = require("jsonld");

let didDoc = JSON.parse(fs.readFileSync('../../../index.jsonld', 'utf-8'));

const documentLoader = jsonld.documentLoaders.node();

const wrappedDocumentLoader = () => {
  return async url => {
    if (url.startsWith("https://w3id.org/did/v1")) {
      return documentLoader(
        "https://raw.githubusercontent.com/w3c-ccg/did-spec/gh-pages/contexts/did-v0.11.jsonld"
      );
    }
    return documentLoader(url);
  };
};

const isValidProof = async didDocument => {
  if (!didDocument.proof) {
    return false;
  }
  const verificationMethod = didDocument.proof.verificationMethod
    ? didDocument.proof.verificationMethod
    : didDocument.proof.creator;

  const didPublicKey = didDocument.publicKey.find(k => {
    return k.id == verificationMethod;
  });

  if (didPublicKey.type === "Ed25519VerificationKey2018") {
    const result = await jsigs.verify(didDocument, {
      documentLoader: wrappedDocumentLoader(),
      suite: new Ed25519Signature2018({
        key: new Ed25519KeyPair(didPublicKey)
      }),
      purpose: new AssertionProofPurpose({ controller: didDocument })
    });
    return result.verified;
  }
  // TODO: Support OpenPGPVerificationKey2018
  return false;
}

const signDidDocument = async didDocument => {
  delete didDocument.proof;
  const encryptedWallet = process.env.DID_WALLET;
  const password = process.env.DID_WALLET_PASSWORD;
  const wallet = ghdid.createWallet(encryptedWallet);
  wallet.unlock(password);

  const primaryPublicKey = didDocument.publicKey.find(
    (pk) => pk.type === 'Ed25519VerificationKey2018',
  );
  const [did, kid] = primaryPublicKey.id.split('#');
  const primaryKey = wallet.keys[kid];
  const publicKeyId = `${did}#${primaryKey.kid}`;
  const signed = await jsigs.sign(didDocument, {
    documentLoader: wrappedDocumentLoader({}),
    suite: new Ed25519Signature2018({
      verificationMethod: publicKeyId,
      key: new Ed25519KeyPair({
        privateKeyBase58: primaryKey.privateKey,
        publicKeyBase58: primaryKey.publicKey
      })
    }),
    purpose: new AssertionProofPurpose({ controller: didDocument }),
    compactProof: false
  });
  const didDocumentString = JSON.stringify(signed, null, 2);
  fs.writeFileSync('../../../index.jsonld', didDocumentString);
  return signed;
}

(async () => {
    let verified = await isValidProof(didDoc);
    console.log('Did Document is valid ?', verified);
    if (!verified) {
      console.log('Signing...')
      didDoc = await signDidDocument(didDoc);
    }
    verified = await isValidProof(didDoc);
    console.log('Did Document is valid ?', verified);
})();
