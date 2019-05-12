const fixtures = require("../__fixtures__");
const createWallet = require("./createWallet");
const signWithWallet = require("./signWithWallet");

describe("signWithWallet", () => {
  it("can sign with wallet", async () => {
    const wallet = await createWallet(fixtures.encryptedWallet);
    wallet.unlock("password");
    const data = {
      "@context": "https://w3id.org/identity/v1",
      givenName: "Alice"
    };
    const kid = Object.keys(wallet.keys)[0];
    const signed = await signWithWallet(data, "did:github:or13", kid, wallet);
    console.log(JSON.stringify(signed));
    
    expect(signed.proof.creator).toBe(
      `did:github:or13#kid=BW_Xb3H0Ah1MCFhmigbOOttLo4e97gP6AAt3uj8ASGQ`
    );


  });
});
