const jsigs = require("jsonld-signatures");
const { Ed25519KeyPair } = require("crypto-ld");
const { Ed25519Signature2018 } = jsigs.suites;
const { AssertionProofPurpose, AuthenticationProofPurpose } = jsigs.purposes;

const { documentLoaders } = require("jsonld");
// we will need the documentLoader to verify the controller
const { node: documentLoader } = documentLoaders;

const publicKeyBase58 = "J5QHWFQNREPBnmwCDXZgzy5FjvDGFkLEgWVoEociTfXz";
const privateKeyBase58 =
  "2zFSMA9EHEuEfFNydcMehd8a11PjFwKdTTkHaXKEvoajSAKAMi1zny5Bob4eCgWYUNa7RTkkYydz6CBAS6eqGmLg";

// specify the public key object
const publicKey = {
  "@context": jsigs.SECURITY_CONTEXT_URL,
  type: "Ed25519VerificationKey2018",
  id: "https://example.com/i/alice/keys/2",
  controller: "https://example.com/i/alice",
  publicKeyBase58
};

// specify the public key controller object
const controller = {
  "@context": jsigs.SECURITY_CONTEXT_URL,
  id: "https://example.com/i/alice",
  publicKey: [publicKey],
  // this authorizes this key to be used for authenticating
  authentication: [publicKey.id],
  assertionMethod: [publicKey.id]
};

// create the JSON-LD document that should be signed
const doc = {
  "@context": {
    schema: "http://schema.org/",
    action: "schema:action"
  },
  action: "AuthenticateMe"
};

describe("ed25519", () => {
  it("sign verify", async () => {
    const signed = await jsigs.sign(doc, {
      documentLoader,
      compactProof: false,
      suite: new Ed25519Signature2018({
        verificationMethod: publicKey.id,
        key: new Ed25519KeyPair({ privateKeyBase58, publicKeyBase58 })
      }),
      // purpose: new AuthenticationProofPurpose({
      //   challenge: "abc",
      //   domain: "example.com"
      // })
      purpose: new AssertionProofPurpose()
    });

    // console.log("Signed document:", signed);

    // verify the signed document
    const result = await jsigs.verify(signed, {
      documentLoader,
      compactProof: false,
      suite: new Ed25519Signature2018({
        key: new Ed25519KeyPair(publicKey)
      }),
      // purpose: new AuthenticationProofPurpose({
      //   controller,
      //   challenge: "abc",
      //   domain: "example.com"
      // })
      purpose: new AssertionProofPurpose({ controller })
    });
    expect(result.verified).toBe(true);

    // if (result.verified) {
    //   console.log("Signature verified.");
    // } else {
    //   console.log("Signature verification error:", result.error);
    // }
  });
});
