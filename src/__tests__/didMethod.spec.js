const ghdid = require("../ghdid");

const { wallet } = require("./__fixtures__");

const kid = Object.keys(wallet.data.keystore)[0];

describe("ghdid", () => {
  it("supports ghdid transforms", async () => {
    const did = ghdid.createDID(
      "ghdid",
      "transmute-industries",
      "github-did",
      kid
    );
    expect(did).toEqual(
      "did:ghdid:transmute-industries~github-did~8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e"
    );
    const didDocumentUrl = ghdid.didToDIDDocumentURL(did);
    expect(didDocumentUrl).toEqual(
      "https://raw.githubusercontent.com/transmute-industries/github-did/master/dids/8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e.jsonld"
    );
  });
});
