const _ = require("lodash");

const createPublicKeyIDFromDIDAndKey = require("./createPublicKeyIDFromDIDAndKey");
const signWithWallet = require("./signWithWallet");
const findPublicKeyTypeKey = key => {
  if (key.encoding === "application/pgp-keys") {
    return "OpenPgpVerificationKey2019";
  }

  if (key.tags.includes("Secp256k1VerificationKey2018")) {
    return "Secp256k1VerificationKey2018";
  }

  if (key.tags.includes("Ed25519VerificationKey2018")) {
    return "Ed25519VerificationKey2018";
  }

  if (key.tags.includes("RsaSignature2017")) {
    return "RsaSignature2017";
  }
};

// https://w3c-ccg.github.io/did-spec/
// publicKeyPem, publicKeyJwk, publicKeyHex, publicKeyBase64, publicKeyBase58, publicKeyMultibase
const findPublicKeyPropertyNameFromKey = key => {
  if (key.encoding === "application/pgp-keys") {
    return "publicKeyPem";
  }
  if (key.encoding === "application/x-pem-file") {
    return "publicKeyPem";
  }
  if (key.didPublicKeyEncoding) {
    return key.didPublicKeyEncoding;
  }
};

module.exports = async (wallet, options) => {
  let doc = {
    "@context": "https://w3id.org/did/v1",
    id: options.id,
    publicKey: options.publicKey || [],
    authentication: options.authentication || [],
    service: options.service || []
  };

  if (options.includeKeysWithTags) {
    const onlyWebKeys = wallet.extractByTags(options.includeKeysWithTags);
    const didPublicKeys = onlyWebKeys.map(k => {
      return {
        // encoding: k.encoding,
        type: findPublicKeyTypeKey(k),
        id: createPublicKeyIDFromDIDAndKey(options.id, k),
        controller: options.id,
        [findPublicKeyPropertyNameFromKey(k)]: k.publicKey
      };
    });
    doc.publicKey = _.uniqBy([...doc.publicKey, ...didPublicKeys], k => {
      return k.id;
    });
  }

  if (doc.publicKey.length === 1) {
    doc.authentication = _.uniqBy(
      [...doc.authentication, doc.publicKey[0].id],
      k => {
        return k.id || k;
      }
    );
  }

  if (options.signWithKID) {
    doc = signWithWallet(doc, options.id, options.signWithKID, wallet);
  }

  return doc;
};
