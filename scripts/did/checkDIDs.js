#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const { verifyDIDDocumentWasSignedByID } = require("../../src/utils");

const didDir = path.resolve(process.cwd(), "./dids");

(async () => {
  fs.readdir(didDir, async (err, items) => {
    // console.log(err, items);

    for (var i = 0; i < items.length; i++) {
      console.log();
      const docPath = path.resolve(
        process.cwd(),
        "./dids",
        items[i] + "/didDocument.json"
      );
      const docSigPath = path.resolve(
        process.cwd(),
        "./dids",
        items[i] + "/didDocument.sig"
      );
      const verified = await verifyDIDDocumentWasSignedByID(
        docPath,
        docSigPath
      );

      if (!verified) {
        console.log("🧟  Verification failed.");
        console.log(docPath);
        process.exit(1);
      }
      //   console.log(verified);
    }

    console.log("🌟  Verification complete. All DID Documents signed.");
    process.exit(0);
  });
})();
