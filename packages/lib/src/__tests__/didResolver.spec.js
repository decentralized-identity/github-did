const ghdid = require("../index");

const did =
  "did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a";


jest.setTimeout(5 * 1000);

describe("didResolver", () => {
  it("can resolve a did", async () => {
    const resolvedDocumet = await ghdid.resolver.resolve(did);
    expect(resolvedDocumet.id).toEqual(did);
  });

  it("can resolve a github username dids", async () => {
    const resolvedDocumet = await ghdid.resolver.resolve('did:github:or13');
    expect(resolvedDocumet.id).toEqual('did:github:or13');
  });

  it("can verify with resolver", async () => {
    const resolvedDocumet = await ghdid.resolver.resolve(did);
    const verified = await ghdid.verify({
      data: resolvedDocumet
    });
    expect(verified).toBe(true);
  });
});
