#!/usr/bin/env node

const path = require("path");

const { verifyDIDDocumentWasSignedByID } = require("../../src/utils");

const didDocumentPath = path.resolve(process.cwd(), process.argv[2]);
const didDocumentSignaturePath = path.resolve(process.cwd(), process.argv[3]);

(async () => {
  // console.log("verifyDIDDocumentWasSignedByID");
  const success = await verifyDIDDocumentWasSignedByID(
    didDocumentPath,
    didDocumentSignaturePath
  );

  if (success) {
    console.log("✅  DID Document verified.");
    process.exit(0);
  } else {
    process.exit(1);
  }
})();
