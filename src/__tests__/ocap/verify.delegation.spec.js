const ghdid = require("../../ghdid");
const fixtures = require("../__fixtures__");

describe("ghdid", () => {
  it(
    "verify invocation delegation and capability ",
    async () => {
      const did =
        "did:ghdid:transmute-industries~github-did~74b99183-149b-4bc1-800b-560979347fa6";
      const verified = await ghdid.verifyCapability({
        did
      });
      expect(verified).toBe(true);
    },
    10 * 1000
  );

  it(
    "verify fails when tampered",
    async () => {
      const did =
        "did:ghdid:transmute-industries~github-did~74b99183-149b-4bc1-800b-560979347fa6";
      const verified = await ghdid.verifyCapability({
        did,
        capabilityResolver: {
          resolve: did => {
            if (did === fixtures.ocap.caps.delegation.id) {
              return {
                ...fixtures.ocap.caps.delegation,
                invoker: "hacker"
              };
            } else {
              return ghdid.resolver.resolve(did);
            }
          }
        }
      });
      expect(verified).toBe(false);
    },
    10 * 1000
  );
});
