const fetch = require("node-fetch");

const {
  createWallet,
  TransmuteDIDWallet,
  constructDIDPublicKeyID,
  DIDLinkedDataSignatureVerifier,
  openpgpExtensions,
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
  const [_, method, identifier] = did.split(":");
  if (_ !== "did") {
    throw new Error("Invalid DID");
  }
  if (method !== "ghdid") {
    throw new Error("Invalid ghdid");
  }
  const [username, repo, kid] = identifier.split("~");
  const base = "https://raw.githubusercontent.com/";
  const didRepoDir = "/master/dids";
  return `${base}${username}/${repo}${didRepoDir}/${kid}.jsonld`;
};

const addKeyWithTag = async ({ wallet, email, passphrase, tag }) => {
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
      tags: ["OpenPgpSignature2019", "PROPOSAL", tag],
      notes: "Created for Github DID",
      did: {
        publicKey: true,
        authentication: true,
        publicKeyType: "publicKeyPem",
        signatureType: "OpenPgpSignature2019"
      }
    }
  );
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
    return privateKey;
  }
};

const verifyCapability = async ({ did, capabilityResolver }) => {
  // console.log("verifying: ", did);

  if (!capabilityResolver) {
    capabilityResolver = resolver;
  }

  const data = await capabilityResolver.resolve(did);

  const verified = await verify({
    data
  });

  if (!verified) {
    return false;
  }
  // console.log("verified: ", verified);
  if (data.capability) {
    return verifyCapability({
      did: data.capability,
      capabilityResolver
    });
  }
  if (data.parentCapability) {
    return verifyCapability({
      did: data.parentCapability,
      capabilityResolver
    });
  }
  // we ended on a did document
  return data.publicKey.length !== undefined;
};

module.exports = {
  createWallet,
  TransmuteDIDWallet,
  constructDIDPublicKeyID,
  getUnlockedPrivateKey,
  createDID,
  didToDIDDocumentURL,
  getJson,
  addKeyWithTag,
  sign,
  verify,
  openpgpExtensions,
  verifyCapability,
  resolver
};
