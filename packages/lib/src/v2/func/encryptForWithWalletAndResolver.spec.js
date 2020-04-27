const fixtures = require("../__fixtures__");
const createWallet = require("./createWallet");
const encryptForWithWalletAndResolver = require("./encryptForWithWalletAndResolver");
const createWalletResolver = require("./createWalletResolver");

describe("encryptForWithWalletAndResolver", () => {
  it("can encryptFor with wallet", async () => {
    const wallet = await createWallet({
      keys: fixtures.testWalletKeys
    });

    const data = {
      "@context": "https://w3id.org/identity/v1",
      givenName: "Alice"
    };

    const walletResolver = createWalletResolver(wallet);

    const payload = await encryptForWithWalletAndResolver({
      data,
      fromPublicKeyId: "did:example:456#" + fixtures.testWalletKeys[0].kid,
      toPublicKeyId: "did:example:456#" + fixtures.testWalletKeys[0].kid,
      wallet,
      resolver: walletResolver
    });

    expect(payload.fromPublicKeyId).toBe(
      "did:example:456#" + fixtures.testWalletKeys[0].kid
    );
    expect(payload.toPublicKeyId).toBe(
      "did:example:456#" + fixtures.testWalletKeys[0].kid
    );

    // console.log(JSON.stringify(payload, null, 2));
  });
});
