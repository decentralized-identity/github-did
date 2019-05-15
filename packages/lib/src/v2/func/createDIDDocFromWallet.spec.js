const createDIDDocFromWallet = require("./createDIDDocFromWallet");
const createKeypair = require("./createKeypair");
const addKeyToWallet = require("./addKeyToWallet");
const createWallet = require("./createWallet");

describe("createDIDDocFromWallet", () => {
  it("create a did doc from a did-wallet", async () => {
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

    const kid = Object.keys(updatedWallet.keys)[0];

    const doc = await createDIDDocFromWallet(updatedWallet, {
      signWithKID: kid,
      includeKeysWithTags: ["did:example:456"],
      id: "did:example:456",
      publicKey: [],
      service: [],
      authentication: []
    });

    // console.log(JSON.stringify(updatedWallet, null, 2));

    expect(doc.id).toBe("did:example:456");
    expect(doc.publicKey.length).toBe(1);
  });
});
