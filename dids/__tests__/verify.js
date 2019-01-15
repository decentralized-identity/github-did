const path = require("path");
var fs = require("fs");

const files = fs.readdirSync(path.resolve(__dirname, "../"));

const ghdid = require("../../src/index");

describe("verify", () => {
  files.map(f => {
    if (f !== "__tests__") {
      const didDoc = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "../", f))
      );
      it(didDoc.id, async () => {
        const verified = await ghdid.verify({
          data: didDoc
        });
        expect(verified).toBe(true);
      });
    }
  });
});
