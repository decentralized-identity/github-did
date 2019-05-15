const fixtures = require("../__fixtures__");
const createWallet = require("./createWallet");
const decryptForWithWalletAndResolver = require("./decryptForWithWalletAndResolver");
const createWalletResolver = require("./createWalletResolver");

describe("decryptForWithWalletAndResolver", () => {
  it("can decryptForWithWalletAndResolver", async () => {
    const wallet = await createWallet({
      keys: fixtures.testWalletKeys
    });

    const walletResolver = createWalletResolver(wallet);

    const { encryptedMessageFor } = fixtures;

    const decrypted = await decryptForWithWalletAndResolver({
      data: encryptedMessageFor.cipherText,
      fromPublicKeyId: encryptedMessageFor.fromPublicKeyId,
      toPublicKeyId: encryptedMessageFor.toPublicKeyId,
      wallet,
      resolver: walletResolver
    });

    const data = {
      "@context": "https://w3id.org/identity/v1",
      givenName: "Alice"
    };

    expect(decrypted).toEqual(data);
  });
});
