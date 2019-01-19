const ghdid = require("../../index");

describe("ghdid", () => {
  it("verify capability", async () => {
    const did =
      "did:ghdid:transmute-industries~github-did~4d606898-7505-4bfd-a6da-e40d02795b41";
    const url = await ghdid.didToDIDDocumentURL(did);
    const capability = await ghdid.getJson(url);
    const verified = await ghdid.verify({
      data: capability
    });
    expect(verified).toBe(true);
  });

  it("verify delegation", async () => {
    const did =
      "did:ghdid:transmute-industries~github-did~6cea3a32-f817-4116-a844-fa2371285ba2";
    const url = await ghdid.didToDIDDocumentURL(did);
    const delegation = await ghdid.getJson(url);
    const verified = await ghdid.verify({
      data: delegation
    });
    expect(verified).toBe(true);
  });

  it("verify invocation", async () => {
    const did =
      "did:ghdid:transmute-industries~github-did~74b99183-149b-4bc1-800b-560979347fa6";
    const url = await ghdid.didToDIDDocumentURL(did);
    const invocation = await ghdid.getJson(url);
    const verified = await ghdid.verify({
      data: invocation
    });
    expect(verified).toBe(true);
  });
});
