const {
  createWallet,
  constructDIDPublicKeyID,
  DIDLinkedDataSignatureVerifier
} = require("@transmute/transmute-did");

const openpgp = require("openpgp");

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

module.exports = {
  createDID,
  didToDIDDocumentURL,
  createDIDWallet
};
