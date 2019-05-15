const { private_key, public_key } = require("../__fixtures__");

const RsaSignature2017 = require("@transmute/rsasignature2017");

const jwt = require("jsonwebtoken");

const didAuthNistPulse = require("./nistPulse");

describe("DID Auth with Nist Beacon", () => {
  let jwt_nist_pulse;
  let jsonld_nist_pulse;

  it("can create a JSON-LD Signature with wallet keypair", async () => {
    const pulse = await didAuthNistPulse.getLastHourPulse();
    const signature = await RsaSignature2017.sign({
      data: {
        subject: "did:test:123",
        did_auth_nist_pulse: pulse
      },
      creator: `did:test:123#kid=123`,
      privateKey: private_key
    });

    jsonld_nist_pulse = signature;

    const verified = await RsaSignature2017.verify({
      data: signature,
      publicKey: public_key
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
    const token = jwt.sign(payload, private_key, {
      algorithm: "RS256"
    });
    jwt_nist_pulse = token;
    const res = jwt.verify(token, public_key, {
      algorithm: "RS256"
    });
    expect(res.sub).toBe(payload.sub);
    expect(res.iss).toBe(payload.iss);
  });

  it("can authenticate did with jsonld_nist_pulse", async () => {
    const verified = await didAuthNistPulse.verify(
      jsonld_nist_pulse,
      public_key,
      {
        RsaSignature2017
      }
    );
    expect(verified).toBe(true);
  });

  it("can authenticate did with jwt_nist_pulse", async () => {
    const verified = await didAuthNistPulse.verify(jwt_nist_pulse, public_key);
    expect(verified).toBe(true);
  });
});
