const ghdid = require("../ghdid");

const did =
  "did:ghdid:transmute-industries~github-did~4d606898-7505-4bfd-a6da-e40d02795b41";

describe("ghdid", () => {
  it("can resolve a did", async () => {
    const resolvedDocumet = await ghdid.resolver.resolve(did);
    expect(resolvedDocumet.id).toEqual(did);
  });

  it("can verify with resolver", async () => {
    const resolvedDocumet = await ghdid.resolver.resolve(did);
    const verified = await ghdid.verify({
      data: resolvedDocumet
    });
    expect(verified).toBe(true);
  });
});
