const jsigs = require("jsonld-signatures");
const { Ed25519KeyPair } = require("crypto-ld");
const { Ed25519Signature2018 } = jsigs.suites;
const { AssertionProofPurpose, AuthenticationProofPurpose } = jsigs.purposes;

const wrappedDocumentLoader = require("../func/wrappedDocumentLoader");

const keypair = {
  publicKey: "J5QHWFQNREPBnmwCDXZgzy5FjvDGFkLEgWVoEociTfXz",
  privateKey:
    "2zFSMA9EHEuEfFNydcMehd8a11PjFwKdTTkHaXKEvoajSAKAMi1zny5Bob4eCgWYUNa7RTkkYydz6CBAS6eqGmLg"
};

const didDoc = {
  "@context": "https://w3id.org/did/v1",
  id: "did:example:456",
  publicKey: [
    {
      "@context": jsigs.SECURITY_CONTEXT_URL,
      type: "OpenPgpVerificationKey2019",
      id: "did:example:456#nUN4nXQS5MwaLtSGPiWv0Cx7_WbZ6-BcXow6g6g_LEs",
      controller: "did:example:456",
      publicKeyPem:
        "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXNtmfBMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRdhbm9uIDxh\r\nbm9uQGV4YW1wbGUuY29tPsJ3BBATCAAfBQJc22Z8BgsJBwgDAgQVCAoCAxYC\r\nAQIZAQIbAwIeAQAKCRDWxr9HLkZ5BNroAP9SBAXVyU8FWTMPoKagkeiZO5ke\r\nLKAi3bQXZp/20YNEFwD/c87ILNqic2LS5poaSimnBOIgU6gKX81z3NFdLkyz\r\nNnvOUwRc22Z8EgUrgQQACgIDBDbYm4os7DRESOAfco+V2+lAvI9t687qd3++\r\nz+FTIGBEMWEHrp5qbQqDQr9sWyl3sSoFB/myDgyO1baD5SUw24ADAQgHwmEE\r\nGBMIAAkFAlzbZnwCGwwACgkQ1sa/Ry5GeQRkEQD+LG6fEloMaItQNk5rca2A\r\nfwAFlvz4zKzaU+WtftJbgskA/i2vlR/dEZGMGjH4X/Nfe/bvg58MruAPa+mH\r\nGj0YBs1U\r\n=W2LQ\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
    },
    {
      type: "Ed25519VerificationKey2018",
      id: "did:example:456#Wer8LMAAQgUAmj78VhIVwVs3pmn7fPNLf_09_jPgQHk",
      controller: "did:example:456",
      publicKeyBase58: "J5QHWFQNREPBnmwCDXZgzy5FjvDGFkLEgWVoEociTfXz"
    }
  ],
  authentication: [
    "did:example:456#Wer8LMAAQgUAmj78VhIVwVs3pmn7fPNLf_09_jPgQHk"
  ],
  service: [],
  capabilityDelegation: [
    "did:example:456#Wer8LMAAQgUAmj78VhIVwVs3pmn7fPNLf_09_jPgQHk"
  ],
  capabilityInvocation: [
    "did:example:456#Wer8LMAAQgUAmj78VhIVwVs3pmn7fPNLf_09_jPgQHk"
  ],
  assertionMethod: [
    "did:example:456#Wer8LMAAQgUAmj78VhIVwVs3pmn7fPNLf_09_jPgQHk"
  ],
  keyAgreement: [
    {
      id: "did:example:456#zCHdZuV6kizwRtLTYKL4KF57vtbvxQdB5YxXZBLERvh6co",
      type: "X25519KeyAgreementKey2019",
      controller: "did:example:456",
      publicKeyBase58: "J8rC7uwXdC9TEQZrvZkGuxFbMf9T4UU44eG9V9dXarWb"
    }
  ],
  proof: {
    type: "Ed25519Signature2018",
    created: "2019-11-15T23:05:57Z",
    verificationMethod:
      "did:example:456#Wer8LMAAQgUAmj78VhIVwVs3pmn7fPNLf_09_jPgQHk",
    proofPurpose: "assertionMethod",
    jws:
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..dd-RtJ7dVrcccN3JsGkZlQUoBOBBZ5mzyT3pHp02QWPLnZH9dN1y5dzPBvat9tLkkbkcFjO5nU1JNT41I3-9Aw"
  }
};

const data = {
  "@context": [
    "https://w3id.org/did/v1",
    {
      schema: "http://schema.org/",
      action: "schema:action"
    }
  ],
  action: "AuthenticateMe"
};

describe("ed25519", () => {
  it("sign verify", async () => {
    const signed = await jsigs.sign(data, {
      documentLoader: wrappedDocumentLoader({
        //args that are needed in the wrapper.. such as zcaps
      }),
      suite: new Ed25519Signature2018({
        verificationMethod: didDoc.publicKey[1].id,
        key: new Ed25519KeyPair({
          privateKeyBase58: keypair.privateKey,
          publicKeyBase58: keypair.publicKey
        })
      }),
      // purpose: new AssertionProofPurpose({ controller }),
      purpose: new AuthenticationProofPurpose({
        challenge: "abc",
        domain: "example.com"
      }),
      compactProof: false
    });

    // console.log(signed);

    const result = await jsigs.verify(signed, {
      documentLoader: wrappedDocumentLoader({
        //args that are needed in the wrapper.. such as zcaps
      }),
      suite: new Ed25519Signature2018({
        key: new Ed25519KeyPair(didDoc.publicKey[1])
      }),
      // purpose: new AssertionProofPurpose({ controller })
      purpose: new AuthenticationProofPurpose({
        controller: didDoc,
        challenge: "abc",
        domain: "example.com"
      })
    });
    expect(result.verified).toBe(true);
  });
});
