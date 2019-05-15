const ghdid = require("../func");

describe("wallet-did-setup", () => {
  let rootWalletExport;
  let webWalletExport;
  let firstDIDDoc;
  let secondDIDDoc;
  it("create wallet and export", async () => {
    const wallet = await ghdid.createWallet();

    const key = await ghdid.createKeypair({
      userIds: [{ name: "anon", email: "anon@example.com" }],
      curve: "secp256k1"
    });

    const updatedWallet = ghdid.addKeyToWallet(wallet, {
      type: "assymetric",
      encoding: "application/pgp-keys",
      publicKey: key.publicKeyArmored,
      privateKey: key.privateKeyArmored,
      revocationCertificate: key.revocationCertificate,
      tags: ["Secp256k1VerificationKey2018", "did:github:example123", "web"],
      notes: "First key created with OpenPGP.js"
    });

    firstDIDDoc = await ghdid.createDIDDocFromWallet(wallet, {
      signWithKID: Object.keys(updatedWallet.keys)[0],
      includeKeysWithTags: ["did:github:example123"],
      id: "did:github:example123",
      publicKey: [],
      service: [],
      authentication: []
    });

    expect(firstDIDDoc.id).toBe("did:github:example123");
    expect(firstDIDDoc.publicKey.length).toBe(1);

    updatedWallet.lock("password");
    rootWalletExport = updatedWallet.export();
  });

  it("import wallet, add key and export", async () => {
    const wallet = ghdid.createWallet(rootWalletExport);
    wallet.unlock("password");

    const key = await ghdid.createKeypair({
      userIds: [{ name: "anon", email: "anon@example.com" }],
      curve: "secp256k1"
    });

    const updatedWallet = ghdid.addKeyToWallet(wallet, {
      type: "assymetric",
      encoding: "application/pgp-keys",
      publicKey: key.publicKeyArmored,
      privateKey: key.privateKeyArmored,
      revocationCertificate: key.revocationCertificate,
      tags: ["Secp256k1VerificationKey2018", "did:github:example123"],
      notes: "Second key created with OpenPGP.js"
    });

    secondDIDDoc = await ghdid.createDIDDocFromWallet(wallet, {
      signWithKID: Object.keys(updatedWallet.keys)[0],
      includeKeysWithTags: ["did:github:example123"],
      ...firstDIDDoc
    });

    expect(secondDIDDoc.id).toBe("did:github:example123");
    expect(secondDIDDoc.publicKey.length).toBe(2);

    const webKeys = updatedWallet.extractByTags(["web"]);
    const webWallet = ghdid.createWallet({ keys: webKeys });
    webWallet.lock("password");
    webWalletExport = webWallet.export();

    updatedWallet.lock("password");
    rootWalletExport = updatedWallet.export();

    expect(webWalletExport).not.toBe(rootWalletExport);

    // console.log(rootWalletExport)
  });
});
