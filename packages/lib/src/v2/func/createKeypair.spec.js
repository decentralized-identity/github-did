const createKeypair = require("./createKeypair");

describe("createKeypair", () => {
  const isValidKey = key => {
    var privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    var pubkey = key.publicKeyArmored; // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    var revocationCertificate = key.revocationCertificate; // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

    expect(privkey).toBeDefined();
    expect(pubkey).toBeDefined();
    expect(revocationCertificate).toBeDefined();
  };

  it("can create an RSA keypair", async () => {
    var options = {
      userIds: [{ name: "anon", email: "anon@example.com" }], // multiple user IDs
      numBits: 512 // turn this up 4096... this is only for testing speed.
      //   passphrase: "super long and hard to guess secret" // protects the private key
    };
    const key = await createKeypair(options);
    isValidKey(key);
  });

  it("can create an secp256k1 keypair", async () => {
    var options = {
      userIds: [{ name: "anon", email: "anon@example.com" }], // multiple user IDs
      curve: "secp256k1"
      //   passphrase: "super long and hard to guess secret" // protects the private key
    };
    const key = await createKeypair(options);
    isValidKey(key);
  });
});
