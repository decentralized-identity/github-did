const fetch = require("node-fetch");

const {
  createWallet,
  constructDIDPublicKeyID,
  DIDLinkedDataSignatureVerifier
} = require("@transmute/transmute-did");

const OpenPgpSignature2019 = require("@transmute/openpgpsignature2019");
const openpgp = require("openpgp");

const getJson = async url => {
  const data = await (await fetch(url, {
    method: "get",
    headers: {
      Accept: "application/ld+json"
    }
  })).json();
  return data;
};

const createDID = (method, user, repo, kid) => {
  return `did:${method}:${user}~${repo}~${kid}`;
};

const didToDIDDocumentURL = did => {
  const parts = did.split(":");
  const idParts = parts[2].split("~");
  const base = "https://raw.githubusercontent.com/";
  const didRepoDir = "/master/dids";
  return `${base}${idParts[0]}/${idParts[1]}${didRepoDir}/${idParts[2]}.jsonld`;
};

const createDIDWallet = async ({ email, passphrase }) => {
  const wallet = await createWallet();
  const keypair = await openpgp.generateKey({
    userIds: [
      {
        name: email
      }
    ],
    curve: "secp256k1",
    passphrase: passphrase
  });

  await wallet.addKey(
    {
      publicKey: keypair.publicKeyArmored,
      privateKey: keypair.privateKeyArmored
    },
    "assymetric",
    {
      tags: ["OpenPgpSignature2019", "PROPOSAL"],
      notes: "Created for Github DID",
      did: {
        publicKey: true,
        authentication: true,
        publicKeyType: "publicKeyPem",
        signatureType: "OpenPgpSignature2019"
      }
    }
  );
  return wallet;
};

const resolver = {
  resolve: did => {
    const url = didToDIDDocumentURL(did);
    return getJson(url);
  }
};

const sign = ({ data, creator, privateKey }) => {
  return OpenPgpSignature2019.sign({
    data,
    domain: "github-did",
    signatureAttribute: "proof",
    // compact: true,
    creator,
    privateKey
  });
};

const verify = ({ data }) => {
  return DIDLinkedDataSignatureVerifier.verifyLinkedDataWithDIDResolver({
    data: data,
    resolver: resolver,
    verify: ({ data, publicKey }) => {
      return OpenPgpSignature2019.verify({
        data,
        signatureAttribute: "proof",
        publicKey
      });
    }
  });
};

const getUnlockedPrivateKey = async (armoredPrivateKey, passphrase) => {
  const privateKey = (await openpgp.key.readArmored(armoredPrivateKey)).keys[0];
  try {
    await privateKey.decrypt(passphrase);
    return privateKey;
  } catch (e) {
    if (e.message === "Key packet is already decrypted.") {
      return privateKey;
    }
  }
};

module.exports = {
  constructDIDPublicKeyID,
  getUnlockedPrivateKey,
  createDID,
  didToDIDDocumentURL,
  createDIDWallet,
  sign,
  verify,
  resolver
};
