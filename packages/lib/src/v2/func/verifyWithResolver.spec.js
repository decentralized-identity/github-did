const createWallet = require("./createWallet");
const createWalletResolver = require("./createWalletResolver");
const verifyWithResolver = require("./verifyWithResolver");

describe("verifyWithResolver", () => {
  it("can verify with walletResolver", async () => {
    const wallet = await createWallet({
      keys: [
        {
          type: "assymetric",
          encoding: "application/pgp-keys",
          publicKey:
            "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXNtmfBMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRdhbm9uIDxh\r\nbm9uQGV4YW1wbGUuY29tPsJ3BBATCAAfBQJc22Z8BgsJBwgDAgQVCAoCAxYC\r\nAQIZAQIbAwIeAQAKCRDWxr9HLkZ5BNroAP9SBAXVyU8FWTMPoKagkeiZO5ke\r\nLKAi3bQXZp/20YNEFwD/c87ILNqic2LS5poaSimnBOIgU6gKX81z3NFdLkyz\r\nNnvOUwRc22Z8EgUrgQQACgIDBDbYm4os7DRESOAfco+V2+lAvI9t687qd3++\r\nz+FTIGBEMWEHrp5qbQqDQr9sWyl3sSoFB/myDgyO1baD5SUw24ADAQgHwmEE\r\nGBMIAAkFAlzbZnwCGwwACgkQ1sa/Ry5GeQRkEQD+LG6fEloMaItQNk5rca2A\r\nfwAFlvz4zKzaU+WtftJbgskA/i2vlR/dEZGMGjH4X/Nfe/bvg58MruAPa+mH\r\nGj0YBs1U\r\n=W2LQ\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
          privateKey:
            "-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nxXQEXNtmfBMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAAEAtt9uYl73\r\noEnh1lAB1SqGxc1o1c6C4lx4myXH3P+WRD4SgM0XYW5vbiA8YW5vbkBleGFt\r\ncGxlLmNvbT7CdwQQEwgAHwUCXNtmfAYLCQcIAwIEFQgKAgMWAgECGQECGwMC\r\nHgEACgkQ1sa/Ry5GeQTa6AD/UgQF1clPBVkzD6CmoJHomTuZHiygIt20F2af\r\n9tGDRBcA/3POyCzaonNi0uaaGkoppwTiIFOoCl/Nc9zRXS5MszZ7x3gEXNtm\r\nfBIFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/hUyBgRDFh\r\nB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAwEIBwABALbfbmJe96BJ\r\n4dZQAdUqhsXNaNXOguJceJslx9z/lkQ+EoDCYQQYEwgACQUCXNtmfAIbDAAK\r\nCRDWxr9HLkZ5BGQRAP4sbp8SWgxoi1A2TmtxrYB/AAWW/PjMrNpT5a1+0luC\r\nyQD+La+VH90RkYwaMfhf81979u+Dnwyu4A9r6YcaPRgGzVQ=\r\n=ymNV\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n",
          revocationCertificate:
            "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\nComment: This is a revocation certificate\r\n\r\nwmEEIBMIAAkFAlzbZnwCHQAACgkQ1sa/Ry5GeQTCPwEAw9dNQFkt3KOS4aqz\r\n30i40IvCem+cOUmqtc50aTLkRXQA/2sCJtiHuejFZ3VQp+goWlxRFHQk7z8y\r\nQRojzx15Y/8O\r\n=GXTQ\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
          tags: ["Secp256k1VerificationKey2018", "did:example:456", "OpenPGP"],
          notes: "Created with OpenPGP.js",
          kid: "nUN4nXQS5MwaLtSGPiWv0Cx7_WbZ6-BcXow6g6g_LEs"
        }
      ]
    });

    const walletResolver = createWalletResolver(wallet);
    const verified = await verifyWithResolver(
      {
        "@context": "https://w3id.org/identity/v1",
        givenName: "Alice",
        proof: {
          type: "OpenPgpSignature2019",
          creator:
            "did:example:456#kid=nUN4nXQS5MwaLtSGPiWv0Cx7_WbZ6-BcXow6g6g_LEs",
          domain: "GitHubDID",
          nonce: "f631448205a65e36f7eac4e94e9038b6",
          created: "2019-05-15T01:10:41.974Z",
          signatureValue:
            "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIAAYFAlzbZxIACgkQ1sa/Ry5GeQQ1NQEAujk9hDDwhRlJrPfh7NIY\r\nAU+ow+MUGqmrxlj23k4gkpsBALVXtazXO+BaMHsONWW3lIlGcrWffyQ3lR8P\r\nLI98KBij\r\n=W/4p\r\n-----END PGP SIGNATURE-----\r\n"
        }
      },
      walletResolver
    );
    expect(verified).toBe(true);
  });
});
