const addKeyToWallet = require("./addKeyToWallet");
const createWallet = require("./createWallet");
const createKeypair = require("./createKeypair");

describe("addKeyToWallet", () => {
  it("add a key to a did-wallet ", async () => {
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
});
