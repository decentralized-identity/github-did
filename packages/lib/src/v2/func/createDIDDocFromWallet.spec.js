const keys = [
  {
    type: "assymetric",
    encoding: "application/pgp-keys",
    publicKey:
      "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXNcYixMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRdhbm9uIDxh\r\nbm9uQGV4YW1wbGUuY29tPsJ3BBATCAAfBQJc1xiLBgsJBwgDAgQVCAoCAxYC\r\nAQIZAQIbAwIeAQAKCRCwTHCWbX7xo9zYAP4lYGRD2ywp35Z5CaNUXvwvWZcD\r\nrFKnuIF4ieSGF5QCVgEA/lQGPDea0CtxMslv1e2FhHOolcmkxg39F843fIvY\r\nvNfOUwRc1xiLEgUrgQQACgIDBDbYm4os7DRESOAfco+V2+lAvI9t687qd3++\r\nz+FTIGBEMWEHrp5qbQqDQr9sWyl3sSoFB/myDgyO1baD5SUw24ADAQgHwmEE\r\nGBMIAAkFAlzXGIsCGwwACgkQsExwlm1+8aMIFgD9HnTluyZjjQwC/VgcRyCj\r\nDhRu3gP3cIQZ6aOLCfaJxpoBALkiTB4zCe5px7z+He48tplDcOYPHbrnscz9\r\n1HFCxD5b\r\n=SPPq\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
    privateKey:
      "-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nxXQEXNcYixMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAAEAtt9uYl73\r\noEnh1lAB1SqGxc1o1c6C4lx4myXH3P+WRD4SgM0XYW5vbiA8YW5vbkBleGFt\r\ncGxlLmNvbT7CdwQQEwgAHwUCXNcYiwYLCQcIAwIEFQgKAgMWAgECGQECGwMC\r\nHgEACgkQsExwlm1+8aPc2AD+JWBkQ9ssKd+WeQmjVF78L1mXA6xSp7iBeInk\r\nhheUAlYBAP5UBjw3mtArcTLJb9XthYRzqJXJpMYN/RfON3yL2LzXx3gEXNcY\r\nixIFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/hUyBgRDFh\r\nB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAwEIBwABALbfbmJe96BJ\r\n4dZQAdUqhsXNaNXOguJceJslx9z/lkQ+EoDCYQQYEwgACQUCXNcYiwIbDAAK\r\nCRCwTHCWbX7xowgWAP0edOW7JmONDAL9WBxHIKMOFG7eA/dwhBnpo4sJ9onG\r\nmgEAuSJMHjMJ7mnHvP4d7jy2mUNw5g8duuexzP3UcULEPls=\r\n=Wa2t\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n",
    revocationCertificate:
      "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\nComment: This is a revocation certificate\r\n\r\nwmEEIBMIAAkFAlzXGIsCHQAACgkQsExwlm1+8aONlwD/ScOlSoIRLxyCQblc\r\nm9zPzR7qKvmq/5bDN5vX6XUvOIgBAKKa9rkZf7IxGRI/rz9A/Ynwl5VzHaah\r\n1ys/mzabderk\r\n=3CdS\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
    tags: ["Secp256k1VerificationKey2018", "did:github:OR13", "OpenPGP"],
    notes: "Created with OpenPGP.js"
  }
];

const createDIDDocFromWallet = require("./createDIDDocFromWallet");
const createWallet = require("./createWallet");

describe("createDIDDocFromWallet", () => {
  it("create a did doc from a did-wallet", async () => {
    const wallet = await createWallet({
      keys
    });

    const doc = await createDIDDocFromWallet(wallet, {
      signWithKID: "Iwz3B6EXWQqoEiwkbxTvGrqmmhnE4PM7zAHivVbjLnQ",
      includeKeysWithTags: ["did:github:OR13"],
      id: "did:github:OR13",
      publicKey: [],
      service: [],
      authentication: []
    });

    expect(doc.id).toBe("did:github:OR13");
    expect(doc.publicKey.length).toBe(1);
  });
});
