const addKeyToWallet = require("./addKeyToWallet");
const createWallet = require("./createWallet");
const createKeypair = require("./createKeypair");
const createDIDKeyKeypair = require("./createDIDKeyKeypair");

describe("addKeyToWallet", () => {
  it("add a key pgp key", async () => {
    const wallet = await createWallet();

    const key = await createKeypair({
      userIds: [{ name: "anon", email: "anon@example.com" }],
      curve: "secp256k1"
    });

    const updatedWallet = addKeyToWallet(wallet, {
      type: "assymetric",
      encoding: "application/pgp-keys",
      publicKey: key.publicKeyArmored,
      privateKey: key.privateKeyArmored,
      revocationCertificate: key.revocationCertificate,
      tags: ["Secp256k1VerificationKey2018", "did:example:456", "OpenPGP"],
      notes: "Created with OpenPGP.js"
    });

    expect(wallet).not.toBe(updatedWallet);
    const kid = Object.keys(updatedWallet.keys)[0];
    expect(updatedWallet.keys[kid].publicKey).toBe(key.publicKeyArmored);
  });

  it("add a did:key", async () => {
    const wallet = await createWallet();
    const key = await createDIDKeyKeypair();
    const updatedWallet = addKeyToWallet(wallet, {
      type: "assymetric",
      encoding: "base58",
      didPublicKeyEncoding: "publicKeyBase58",
      publicKey: key.publicKeyBase58,
      privateKey: key.privateKeyBase58,
      tags: [
        "Ed25519VerificationKey2018",
        "did:example:456",
        key.didDocument.id
      ],
      notes: "Created with did:key"
    });
    // console.log(JSON.stringify(updatedWallet, null, 2));
    expect(wallet).not.toBe(updatedWallet);
    const kid = Object.keys(updatedWallet.keys)[0];
    expect(updatedWallet.keys[kid].publicKey).toBe(key.publicKeyBase58);
  });
});
