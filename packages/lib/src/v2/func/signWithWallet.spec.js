const fixtures = require("../__fixtures__");
const createWallet = require("./createWallet");
const signWithWallet = require("./signWithWallet");

describe("signWithWallet", () => {
  it("can sign with gpg wallet", async () => {
    const wallet = await createWallet({
      keys: fixtures.testWalletKeys
    });

    const data = {
      "@context": "https://w3id.org/identity/v1",
      givenName: "Alice"
    };
    const kid = Object.keys(wallet.keys)[0];
    const signed = await signWithWallet(data, "did:example:456", kid, wallet);

    expect(signed.proof.creator).toBe(
      "did:example:456#kid=" + fixtures.testWalletKeys[0].kid
    );
  });

  it("can sign with did:key wallet", async () => {
    const wallet = await createWallet({
      keys: fixtures.testWalletKeys
    });

    const data = {
      "@context": ["https://w3id.org/identity/v1"],
      givenName: "Alice"
    };
    const kid = Object.keys(wallet.keys)[1];
    const signed = await signWithWallet(data, "did:example:456", kid, wallet);

    expect(signed.proof.verificationMethod).toBe(
      "did:example:456#kid=" + fixtures.testWalletKeys[1].kid
    );
  });
});
