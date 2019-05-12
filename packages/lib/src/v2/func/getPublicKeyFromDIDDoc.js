// https://w3c-ccg.github.io/did-spec/

const keyTypes = [
  "publicKeyPem",
  "publicKeyJwk",
  "publicKeyHex",
  "publicKeyBase64",
  "publicKeyBase58",
  "publicKeyMultibase"
];

const getPublicKeyFromDIDDoc = (doc, kid) => {
  for (key of doc.publicKey) {
    if (key.id === kid) {
      for (kt of keyTypes) {
        if (kt in key) {
          return key[kt];
        }
      }
    }
  }
  throw new Error(`No publicKey exists in ${doc.id} for kid: ${kid}`);
};

module.exports = getPublicKeyFromDIDDoc;
