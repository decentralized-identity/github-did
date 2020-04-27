const _ = require("lodash");
const { Ed25519KeyPair } = require("crypto-ld");
const didMethodKey = require("did-method-key");
const { keyToDidDoc } = didMethodKey.driver();

const createPublicKeyIDFromDIDAndKey = require("./createPublicKeyIDFromDIDAndKey");

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

  // console.log();

  const ed25519Key = doc.publicKey.find(k => {
    return k.type === "Ed25519VerificationKey2018";
  });

  if (ed25519Key) {
    const walletKey = wallet.keys[ed25519Key.id.split("#").pop()];
    const publicKeyId = createPublicKeyIDFromDIDAndKey(doc.id, walletKey);

    doc.capabilityDelegation = [publicKeyId];
    doc.capabilityInvocation = [publicKeyId];
    doc.assertionMethod = [publicKeyId];

    const edKey = new Ed25519KeyPair({
      publicKeyBase58: walletKey.publicKey,
      privateKeyBase58: walletKey.privateKey
    });
    const didDoc = keyToDidDoc(edKey);

    doc.keyAgreement = didDoc.keyAgreement;
    doc.keyAgreement[0].controller = doc.id;
    doc.keyAgreement[0].id =
      doc.id + "#" + doc.keyAgreement[0].id.split("#")[1];
  }

  return doc;
};
