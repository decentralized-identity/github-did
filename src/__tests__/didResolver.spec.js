const ghdid = require("../ghdid");
const fixtures = require("./__fixtures__");

describe("ghdid", () => {
  it("can resolve a did", async () => {
    const resolvedDocumet = await ghdid.resolver.resolve(
      fixtures.didDocument.id
    );
    expect(resolvedDocumet).toEqual(fixtures.didDocumentWithProof);
  });

  it("can verify with resolver", async () => {
    const verified = await ghdid.verify({
      data: fixtures.didDocumentWithProof
    });
    expect(verified).toBe(true);
  });
});
