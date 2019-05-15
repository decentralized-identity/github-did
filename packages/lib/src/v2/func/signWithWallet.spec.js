const fixtures = require("../__fixtures__");
const createWallet = require("./createWallet");
const signWithWallet = require("./signWithWallet");

describe("signWithWallet", () => {
  it("can sign with wallet", async () => {
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

    // console.log(JSON.stringify(signed));
  });
});
