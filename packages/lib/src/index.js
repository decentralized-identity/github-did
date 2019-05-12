const fetch = require("node-fetch");

// TODO: remove these OS related bits from this lib.
const path = require("path");
const os = require("os");

const fse = require("fs-extra");

const {
  createWallet,
  TransmuteDIDWallet,
  constructDIDPublicKeyID,
  DIDLinkedDataSignatureVerifier,
  openpgpExtensions,
  getPublicKeyFromDIDDocByKID
} = require("@transmute/transmute-did");

const OpenPgpSignature2019 = require("@transmute/openpgpsignature2019");
const openpgp = require("openpgp");

const v2 = require("./v2");

const getJson = async url => {
  // TODO: remove await
  const data = await (await fetch(url, {
    method: "get",
    headers: {
      Accept: "application/ld+json"
    }
  })).json();
  return data;
};

const cipherTextWalletJsonToPlainTextWalletJson = async (
  cipherTextWalletJson,
  password
) => {
  const instance = new TransmuteDIDWallet(cipherTextWalletJson);
  await instance.decrypt(password);
  return instance.data;
};

const plainTextWalletJsonToCipherTextWalletJson = async (
  plainTextWalletJson,
  password
) => {
  const instance = new TransmuteDIDWallet(plainTextWalletJson);
  await instance.encrypt(password);
  return instance.data;
};

const createDID = (method, user, repo, kid) => {
  return `did:${method}:${user}~${repo}~${kid}`;
};

const didToDIDDocumentURL = did => {
  const [_, method, identifier] = did.split(":");
  if (_ !== "did") {
    throw new Error("Invalid DID");
  }
  if (method !== "ghdid" && method !== "github") {
    throw new Error("Invalid ghdid");
  }

  if (method === "ghdid") {
    const [username, repo, kid] = identifier.split("~");
    const base = "https://raw.githubusercontent.com/";
    const didRepoDir = "/master/dids";
    return `${base}${username}/${repo}${didRepoDir}/${kid}.jsonld`;
  }

  if (method === "github") {
    const base = "https://raw.githubusercontent.com/";
    const didRepoDir = "/master/did.jsonld";
    const url = `${base}${identifier}/did${didRepoDir}`;
    return url;
  }
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

  return wallet.addKey(
    {
      publicKey: keypair.publicKeyArmored,
      privateKey: keypair.privateKeyArmored
    },
    "assymetric",
    {
      tags: ["OpenPgpSignature2019", "PROPOSAL", tag],
      notes: "Created for GitHub DID",
      did: {
        publicKey: true,
        authentication: true,
        publicKeyType: "publicKeyPem",
        signatureType: "OpenPgpSignature2019"
      }
    }
  );
};

const resolveLocally = did => {
  const kid = did.split("~github-did~")[1];
  const didFile = `${kid}.jsonld`;
  const localRepoPath = path.resolve(
    os.homedir(),
    ".github-did/github-did/dids",
    didFile
  );
  const didDocument = JSON.parse(fse.readFileSync(localRepoPath).toString());
  return didDocument;
};

const resolver = {
  resolve: did => {
    const url = didToDIDDocumentURL(did);
    return getJson(url).catch(() => {
      return resolveLocally(did);
    });
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

const getPublicKeyByKeyId = async keyId => {
  const document = await resolver.resolve(keyId.split("#kid=")[0]);
  return await getPublicKeyFromDIDDocByKID(document, keyId);
};

const encryptFor = async ({
  fromKeyId,
  toKeyId,
  publicKey,
  privateKey,
  data
}) => {
  const message = JSON.stringify(data);

  const options = {
    message: openpgp.message.fromText(message), // input as String (or Uint8Array)
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for encryption
    privateKeys: [privateKey] // for signing (optional)
  };

  const cipherText = await openpgp.encrypt(options).then(ciphertext => {
    const encrypted = ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
    return encrypted;
  });

  return {
    fromKeyId,
    toKeyId,
    cipherText
  };
};

const decryptFor = async ({ fromKeyId, cipherText, privateKey }) => {
  const publicKey = await getPublicKeyByKeyId(fromKeyId);
  const options = {
    message: await openpgp.message.readArmored(cipherText), // parse armored message
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for verification (optional)
    privateKeys: [privateKey] // for decryption
  };

  const plainText = await openpgp
    .decrypt(options)
    .then(plaintext => plaintext.data);

  return JSON.parse(plainText);
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
  resolver,
  cipherTextWalletJsonToPlainTextWalletJson,
  plainTextWalletJsonToCipherTextWalletJson,
  getPublicKeyByKeyId,
  encryptFor,
  decryptFor,
  v2
};
