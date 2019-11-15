const createDIDKeyKeypair = require("./createDIDKeyKeypair");

describe("createDIDKeyKeypair", () => {
  const isValidKey = key => {
    expect(key.privateKeyBase58).toBeDefined();
    expect(key.publicKeyBase58).toBeDefined();
    expect(key.type).toBe("Ed25519VerificationKey2018");
    expect(key.didDocument).toBeDefined();
  };

  it("can create a did:key keypair", async () => {
    const key = await createDIDKeyKeypair();
    isValidKey(key);
  });
});
