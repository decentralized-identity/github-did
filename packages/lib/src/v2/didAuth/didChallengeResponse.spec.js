const { private_key, public_key } = require("../__fixtures__");

const RsaSignature2017 = require("@transmute/rsasignature2017");

const jwt = require("jsonwebtoken");

const didAuthChallengeResponse = require("./didChallengeResponse");

// private_key, public_key would be pulled from wallet and resolver in a real setting.
describe.skip("DID Auth Challenge Response", () => {
  let jwt_challenge;
  let jsonld_challenge;

  it("can create a jsonld_challenge", async () => {
    const challenge = await didAuthChallengeResponse.generateChallenge();
    const signature = await RsaSignature2017.sign({
      data: {
        subject: "did:test:123",
        challenge
      },
      creator: `did:test:123#kid=123`,
      privateKey: private_key
    });

    jsonld_challenge = signature;
    const verified = await RsaSignature2017.verify({
      data: signature,
      publicKey: public_key
    });
    expect(verified).toBe(true);
  });

  it("can create a jwt_challenge", async () => {
    const challenge = await didAuthChallengeResponse.generateChallenge();
    const payload = {
      sub: "did:test:123",
      iss: `did:test:123`,
      challenge
    };
    const token = jwt.sign(payload, private_key, {
      algorithm: "RS256"
    });
    jwt_challenge = token;
    const res = jwt.verify(token, public_key, {
      algorithm: "RS256"
    });
    expect(res.sub).toBe(payload.sub);
    expect(res.iss).toBe(payload.iss);
  });

  it("can authenticate did with jsonld_challenge", async () => {
    const signedChallenge = await RsaSignature2017.sign({
      data: {
        subject: "did:test:123",
        did_auth_challenge: jsonld_challenge
      },
      creator: `did:test:456#kid=123`,
      privateKey: private_key
    });

    const verified = await didAuthChallengeResponse.verifySignedChallenge(
      signedChallenge,
      public_key,
      public_key,
      {
        RsaSignature2017
      }
    );
    expect(verified).toBe(true);
  });

  it("can authenticate did with jwt_challenge", async () => {
    const signedChallenge = jwt.sign(
      {
        sub: "did:test:123",
        iss: `did:test:456`,
        did_auth_challenge: jwt_challenge
      },
      private_key,
      {
        algorithm: "RS256"
      }
    );

    const verified = await didAuthChallengeResponse.verifySignedChallenge(
      signedChallenge,
      public_key,
      public_key
    );
    expect(verified).toBe(true);
  });
});
