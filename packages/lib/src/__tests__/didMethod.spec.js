const ghdid = require("../index");

const { wallet } = require("./__fixtures__");

const kid = Object.keys(wallet.data.keystore)[0];

const defaultDID =
  "did:ghdid:transmute-industries~github-did~8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e";

const defaultDIDUrl =
  "https://raw.githubusercontent.com/decentralized-identity/github-did/master/dids/8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e.jsonld";

describe("ghdid", () => {
  describe("createDID", () => {
    it("can create a did from user, repo and kid", async () => {
      const did = ghdid.createDID(
        "ghdid",
        "transmute-industries",
        "github-did",
        kid
      );
      expect(did).toEqual(defaultDID);
    });
  });

  describe("didToDIDDocumentURL", () => {
    it("can get a url for a did document from a did", async () => {
      const didDocumentUrl = ghdid.didToDIDDocumentURL(defaultDID);
      expect(didDocumentUrl).toEqual(defaultDIDUrl);
    });

    it("throws when did is invalid", async () => {
      expect.assertions(1);
      try {
        ghdid.didToDIDDocumentURL("did2:method:identifier");
      } catch (e) {
        expect(e.message).toBe("Invalid DID");
      }
    });

    it("throws when ghdid is invalid", async () => {
      expect.assertions(1);
      try {
        ghdid.didToDIDDocumentURL("did:ghdid-v0:identifier");
      } catch (e) {
        expect(e.message).toBe("Invalid ghdid");
      }
    });
  });
});
