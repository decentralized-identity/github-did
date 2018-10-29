const fs = require("fs");
const openpgp = require("openpgp");

const didMethod = `github.com:transmute-industries:github-did`;


const verifyDIDDocumentWasSignedByID = async (
  didDocumentPath,
  didDocumentSignaturePath
) => {
  const didDocument = fs.readFileSync(didDocumentPath);

  const didDocumentJson = JSON.parse(didDocument);

  const didDocumentSignature = fs
    .readFileSync(didDocumentSignaturePath)
    .toString();

  const signedArmor = didDocumentSignature;
  const pubkey = didDocumentJson.publicKey[0].publicKeyPem;

  options = {
    message: openpgp.message.fromBinary(didDocument), // CleartextMessage or Message object
    signature: await openpgp.signature.readArmored(signedArmor), // parse detached signature
    publicKeys: (await openpgp.key.readArmored(pubkey)).keys // for verification
  };

  const verified = await openpgp.verify(options);
  validity = verified.signatures[0].valid; // true
  // console.log(verified.signatures[0])
  if (validity) {
    // console.log("signed by key id " + verified.signatures[0].keyid.toHex());
    const didParts = didDocumentJson.id.split(":");
    const fingerprint = didParts[didParts.length - 1];
    const signatureMathesFingerprint =
      fingerprint.substring(24).toLowerCase() ===
      verified.signatures[0].keyid.toHex();
    // console.log(signatureMathesFingerprint);
    return signatureMathesFingerprint;
  }
  return false;
};

module.exports = {
  didMethod,
  verifyDIDDocumentWasSignedByID
};
