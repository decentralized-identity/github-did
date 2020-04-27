const fixtures = require("../__fixtures__");
const createWallet = require("./createWallet");
const createWalletResolver = require("./createWalletResolver");
const verifyWithResolver = require("./verifyWithResolver");
const createDIDDocFromWallet = require("./createDIDDocFromWallet");

jest.setTimeout(10 * 1000);
describe("verifyWithResolver", () => {
  it("can verify with walletResolver", async () => {
    const wallet = await createWallet({
      keys: fixtures.testWalletKeys
    });

    const doc = await createDIDDocFromWallet(wallet, {
      signWithKID: fixtures.testWalletKeys[1].kid,
      includeKeysWithTags: ["did:example:456"],
      id: "did:example:456",
      publicKey: [],
      service: [],
      authentication: []
    });

    // console.log(doc);

    const walletResolver = createWalletResolver(wallet);
    const verified = await verifyWithResolver(doc, walletResolver);
    expect(verified).toBe(true);
  });
});
