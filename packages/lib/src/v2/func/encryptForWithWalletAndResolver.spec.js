const fixtures = require("../__fixtures__");
const createWallet = require("./createWallet");
const encryptForWithWalletAndResolver = require("./encryptForWithWalletAndResolver");
const createWalletResolver = require("./createWalletResolver");

describe("encryptForWithWalletAndResolver", () => {
  it("can encryptFor with wallet", async () => {
    const wallet = await createWallet(fixtures.encryptedWallet);
    wallet.unlock("password");

    const data = {
      "@context": "https://w3id.org/identity/v1",
      givenName: "Alice"
    };

    const walletResolver = createWalletResolver(wallet);

    const payload = await encryptForWithWalletAndResolver({
      data,
      fromPublicKeyId:
        "did:github:or13#kid=BW_Xb3H0Ah1MCFhmigbOOttLo4e97gP6AAt3uj8ASGQ",
      toPublicKeyId:
        "did:github:or13#kid=BW_Xb3H0Ah1MCFhmigbOOttLo4e97gP6AAt3uj8ASGQ",
      wallet,
      resolver: walletResolver
    });

    console.log(payload);
  });
});
