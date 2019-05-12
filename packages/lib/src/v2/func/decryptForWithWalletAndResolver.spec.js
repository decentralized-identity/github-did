const fixtures = require("../__fixtures__");
const createWallet = require("./createWallet");
const decryptForWithWalletAndResolver = require("./decryptForWithWalletAndResolver");
const createWalletResolver = require("./createWalletResolver");

describe("decryptForWithWalletAndResolver", () => {
  it("can decryptForWithWalletAndResolver", async () => {
    const wallet = await createWallet(fixtures.encryptedWallet);
    wallet.unlock("password");

    const walletResolver = createWalletResolver(wallet);

    const payload = await decryptForWithWalletAndResolver({
      data: fixtures.encryptedMessageFor.cipherText,
      fromPublicKeyId: fixtures.encryptedMessageFor.fromPublicKeyId,
      toPublicKeyId: fixtures.encryptedMessageFor.toPublicKeyId,
      wallet,
      resolver: walletResolver
    });

    const data = {
      "@context": "https://w3id.org/identity/v1",
      givenName: "Alice"
    };

    expect(payload).toEqual(data);
  });
});
