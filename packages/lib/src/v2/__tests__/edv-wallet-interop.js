const ghdid = require("../func");

describe("edv-wallet-interop", () => {
  let firstDIDDoc;
  it("create wallet and export", async () => {
    const wallet = await ghdid.createWallet();
    const key = await ghdid.createDIDKeyKeypair();

    const updatedWallet = ghdid.addKeyToWallet(wallet, {
      type: "assymetric",
      encoding: "base58",
      didPublicKeyEncoding: "publicKeyBase58",
      publicKey: key.publicKeyBase58,
      privateKey: key.privateKeyBase58,
      tags: [
        "Ed25519VerificationKey2018",
        "did:github:example123",
        key.didDocument.id
      ],
      notes: ""
    });
    firstDIDDoc = await ghdid.createDIDDocFromWallet(wallet, {
      signWithKID: Object.keys(updatedWallet.keys)[0],
      includeKeysWithTags: ["did:github:example123"],
      id: "did:github:example123",
      publicKey: [],
      service: [],
      authentication: []
    });
    // console.log(firstDIDDoc);
    expect(firstDIDDoc.id).toBe("did:github:example123");
    expect(firstDIDDoc.publicKey.length).toBe(1);
    updatedWallet.lock("password");
    rootWalletExport = updatedWallet.export();
  });
});
