const ghdid = require("../ghdid");

const fixtures = require("./__fixtures__");
const kid = Object.keys(fixtures.wallet.data.keystore)[0];

describe("ghdid", () => {
  it("can create a DID Document", async () => {
    const result = await fixtures.wallet.toDIDDocument({
      did: ghdid.createDID("ghdid", "transmute-industries", "github-did", kid),
      cacheLocal: true
    });
    didDocument = result.data;
    expect(didDocument.publicKey[0].type).toBe("OpenPgpSignature2019");
    expect(fixtures.didDocument.id).toBe(didDocument.id);
  });
});
