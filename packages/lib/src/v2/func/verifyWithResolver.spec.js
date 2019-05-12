const fixtures = require("../__fixtures__");
const createWallet = require("./createWallet");
const createWalletResolver = require("./createWalletResolver");
const verifyWithResolver = require("./verifyWithResolver");

describe("verifyWithResolver", () => {
  it("can verify with walletResolver", async () => {
    const wallet = await createWallet(fixtures.encryptedWallet);
    wallet.unlock("password");

    const walletResolver = createWalletResolver(wallet);
    const verified = await verifyWithResolver(
      fixtures.signedJson,
      walletResolver
    );
    expect(verified).toBe(true);
  });
});
