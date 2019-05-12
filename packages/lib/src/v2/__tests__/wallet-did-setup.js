const func = require("../func");

describe("wallet-did-setup", () => {
  let rootWalletExport;
  let webWalletExport;
  let firstDIDDoc;
  let secondDIDDoc;
  it("create wallet and export", async () => {
    const wallet = await func.createWallet();

    const key = await func.createKeypair({
      userIds: [{ name: "anon", email: "anon@example.com" }],
      curve: "secp256k1"
    });

    const updatedWallet = func.addKeyToWallet(wallet, {
      type: "assymetric",
      encoding: "application/pgp-keys",
      publicKey: key.publicKeyArmored,
      privateKey: key.privateKeyArmored,
      revocationCertificate: key.revocationCertificate,
      tags: ["Secp256k1VerificationKey2018", "did:github:or13", "web"],
      notes: "First key created with OpenPGP.js"
    });

    firstDIDDoc = await func.createDIDDocFromWallet(wallet, {
      signWithKID: Object.keys(updatedWallet.keys)[0],
      includeKeysWithTags: ["did:github:or13"],
      id: "did:github:or13",
      publicKey: [],
      service: [],
      authentication: []
    });

    expect(firstDIDDoc.id).toBe("did:github:or13");
    expect(firstDIDDoc.publicKey.length).toBe(1);

    updatedWallet.lock("password");
    rootWalletExport = updatedWallet.export();
  });

  it("import wallet, add key and export", async () => {
    const wallet = func.createWallet(rootWalletExport);
    wallet.unlock("password");

    const key = await func.createKeypair({
      userIds: [{ name: "anon", email: "anon@example.com" }],
      curve: "secp256k1"
    });

    const updatedWallet = func.addKeyToWallet(wallet, {
      type: "assymetric",
      encoding: "application/pgp-keys",
      publicKey: key.publicKeyArmored,
      privateKey: key.privateKeyArmored,
      revocationCertificate: key.revocationCertificate,
      tags: ["Secp256k1VerificationKey2018", "did:github:or13"],
      notes: "Second key created with OpenPGP.js"
    });

    secondDIDDoc = await func.createDIDDocFromWallet(wallet, {
      signWithKID: Object.keys(updatedWallet.keys)[0],
      includeKeysWithTags: ["did:github:or13"],
      ...firstDIDDoc
    });

    expect(secondDIDDoc.id).toBe("did:github:or13");
    expect(secondDIDDoc.publicKey.length).toBe(2);

    const webKeys = updatedWallet.extractByTags(["web"]);
    const webWallet = func.createWallet({ keys: webKeys });
    webWallet.lock("password");
    webWalletExport = webWallet.export();

    updatedWallet.lock("password");
    rootWalletExport = updatedWallet.export();

    expect(webWalletExport).not.toBe(rootWalletExport);

    console.log(rootWalletExport)
  });
});
