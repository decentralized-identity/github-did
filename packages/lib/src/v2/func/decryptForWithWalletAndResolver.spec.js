const createWallet = require("./createWallet");
const decryptForWithWalletAndResolver = require("./decryptForWithWalletAndResolver");
const createWalletResolver = require("./createWalletResolver");

describe("decryptForWithWalletAndResolver", () => {
  it("can decryptForWithWalletAndResolver", async () => {
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

    const payload = {
      fromPublicKeyId:
        "did:example:456#kid=nUN4nXQS5MwaLtSGPiWv0Cx7_WbZ6-BcXow6g6g_LEs",
      toPublicKeyId:
        "did:example:456#kid=nUN4nXQS5MwaLtSGPiWv0Cx7_WbZ6-BcXow6g6g_LEs",
      cipherText:
        "-----BEGIN PGP MESSAGE-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nwX4DYp3oj7ZmdpsSAgMENtibiizsNERI4B9yj5Xb6UC8j23rzup3f77P4VMg\r\nYEQxYQeunmptCoNCv2xbKXexKgUH+bIODI7VtoPlJTDbgDBgpNSCMWnEPkIv\r\ny8NvPO9kdQwp1CNDzKB74pD/+wIdtyuwvEpuGRNZi2RWr/C+AnPSwCYB3JXA\r\neKJAiYmtSKIUkoQghwjDsImPI4ogFHXwdAWUkNfsxBTD7cT9gqi/TCx0hXTF\r\n0urmmJq5Tecbh1EwJbiBpyOfNzneVB0H2Y3IWTWd169Hg23EzHya2tLrhG/n\r\n98qpy79ydnuYEOBzVWSCi+iQQE2xHzHyjcee9oMxadrWOYAmlEmzMHvKIrJG\r\nISkl8OQRymFrLH1FxK602HFaNIq4WKUEBfUbZduoqEPqxNxMLE1w95VpI8Mj\r\n3vOd+Eu+3308t3iVxN7yEWZbNMsNOxvraD/AJYpIZoKYawGUesDT7ZjWXG/Z\r\nEg==\r\n=JkQt\r\n-----END PGP MESSAGE-----\r\n"
    };

    const decrypted = await decryptForWithWalletAndResolver({
      data: payload.cipherText,
      fromPublicKeyId: payload.fromPublicKeyId,
      toPublicKeyId: payload.toPublicKeyId,
      wallet,
      resolver: walletResolver
    });

    const data = {
      "@context": "https://w3id.org/identity/v1",
      givenName: "Alice"
    };

    expect(decrypted).toEqual(data);
  });
});
