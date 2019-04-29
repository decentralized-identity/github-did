const ghdid = require("../../index");

const { private_key, public_key } = require("./__fixtures__");

const RsaSignature2017 = require("@transmute/rsasignature2017");

const jwt = require("jsonwebtoken");

const didAuthNistPulse = require("../nist_pulse");

describe("DID Auth with Nist Beacon", () => {
  let wallet;
  let kid;
  let jwt_nist_pulse;
  let jsonld_nist_pulse;

  it("can add keypair to wallet", async () => {
    wallet = await ghdid.createWallet();
    wallet.addKey(
      {
        publicKey: public_key,
        privateKey: private_key
      },
      "assymetric",
      {
        tags: ["RS256", "JWT"],
        notes: "Created for GitHub DID",
        did: {
          publicKey: true,
          authentication: true,
          publicKeyType: "publicKeyPem",
          signatureType: "RsaSignature2017"
        }
      }
    );

    kid = Object.keys(wallet.data.keystore)[0];
    expect(kid).toBe(
      "93fdb91df8f7b50e0045d17f7a04507fc8ac2252dccc7ad4063e1f146896e73c"
    );
  });

  it("can create a JSON-LD Signature with wallet keypair", async () => {
    const pulse = await didAuthNistPulse.getLastHourPulse();
    const signature = await RsaSignature2017.sign({
      data: {
        subject: "did:test:123",
        did_auth_nist_pulse: pulse
      },
      creator: `did:test:123#kid=${kid}`,
      privateKey: wallet.data.keystore[kid].data.privateKey
    });

    jsonld_nist_pulse = signature;

    const verified = await RsaSignature2017.verify({
      data: signature,
      publicKey: wallet.data.keystore[kid].data.publicKey
    });

    expect(verified).toBe(true);
  });

  it("can create a JWT with wallet keypair", async () => {
    const pulse = await didAuthNistPulse.getLastHourPulse();
    const payload = {
      sub: "did:test:123",
      // see https://tools.ietf.org/html/rfc7519#page-9
      iss: `did:test:123`,
      did_auth_nist_pulse: pulse
    };
    const token = jwt.sign(payload, wallet.data.keystore[kid].data.privateKey, {
      algorithm: "RS256"
    });
    jwt_nist_pulse = token;
    const res = jwt.verify(token, wallet.data.keystore[kid].data.publicKey, {
      algorithm: "RS256"
    });
    expect(res.sub).toBe(payload.sub);
    expect(res.iss).toBe(payload.iss);
  });

  it("can authenticate did with jsonld_nist_pulse", async () => {
    const verified = await didAuthNistPulse.verify(
      jsonld_nist_pulse,
      wallet.data.keystore[kid].data.publicKey,
      {
        RsaSignature2017
      }
    );
    expect(verified).toBe(true);
  });

  it("can authenticate did with jwt_nist_pulse", async () => {
    const verified = await didAuthNistPulse.verify(
      jwt_nist_pulse,
      wallet.data.keystore[kid].data.publicKey
    );
    expect(verified).toBe(true);
  });
});
