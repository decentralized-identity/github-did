const crypto = require("crypto");

const ghdid = require("../../../../index");

const { A, B } = require("./__fixtures__");

const createNonce = () => {
  return crypto.randomBytes(32).toString("hex");
};

const { authEncrypt, authDecrypt } = require("../../didJwt");

describe("DID Mutual Auth with Modified Needham-Schroeder", () => {
  const resolver_table = {};
  const resolver = {
    resolve: did => {
      return resolver_table[did];
    }
  };
  let Na;
  let Nb;
  let message_1_NaForB;
  let message_2_NaNbForA;
  let message_3_NbForB;

  const registerDID = async (did, public_key, private_key) => {
    const wallet = await ghdid.createWallet({
      keys: [
        {
          encoding: 'application/x-pem-file',
          didPublicKeyEncoding: "publicKeyPem",
          type: "assymetric",
          publicKey: public_key,
          privateKey: private_key,
          tags: ["RsaSignature2017", did, "OpenPGP"],
          notes: "Mutual Auth Demo"
        }
      ]
    });

    const doc = await ghdid.createDIDDocFromWallet(wallet, {
      includeKeysWithTags: [did],
      id: did,
      publicKey: [],
      service: [],
      authentication: []
    });

    resolver_table[doc.id] = doc;
  };

  it("can register A", async () => {
    await registerDID("did:test:A", A.public_key, A.private_key);
  });

  it("can register B", async () => {
    await registerDID("did:test:B", B.public_key, B.private_key);
  });

  it("resolver is available to A and B", async () => {
    // This means we don't need a trusted key server S
    let didDocA = await resolver.resolve("did:test:A");
    expect(didDocA.publicKey[0].publicKeyPem).toBe(A.public_key);
    let didDocB = await resolver.resolve("did:test:B");
    expect(didDocB.publicKey[0].publicKeyPem).toBe(B.public_key);
    // We can now refer to A.public_key, instead of resolving it:
    // A.did.id -> didDoc.publicKey[0].publicKeyPem -> A.public_key
  });

  it("A generates Na and encrypts it for B", async () => {
    Na = createNonce();

    message_1_NaForB = authEncrypt(B.public_key, A.private_key, {
      Na
    });
    expect(message_1_NaForB).toBeDefined();
  });

  it("B generates Nb and encrypt [Na, Nb, didB] for A", async () => {
    const NaX = authDecrypt(A.public_key, B.private_key, message_1_NaForB);
    expect(NaX.Na).toBe(Na);
    Nb = createNonce();

    // Fixed by Lowe, include B's DID
    message_2_NaNbForA = authEncrypt(A.public_key, B.private_key, {
      Na: NaX.Na,
      Nb,
      did: "did:test:B"
    });

    expect(message_2_NaNbForA).toBeDefined();
  });

  it("A decrypts NaNb and sends B Nb", async () => {
    let NaNbX = authDecrypt(B.public_key, A.private_key, message_2_NaNbForA);

    let NaX = NaNbX.Na;
    let NbX = NaNbX.Nb;
    let didX = NaNbX.did;

    // here A should use the resolver and confirm once again that
    // this message in particular is signed by a key held by B
    // A has authenticated B if this is true

    expect(NaX).toBe(Na);
    expect(NbX).toBe(Nb);
    expect(didX).toBe("did:test:B");

    message_3_NbForB = authEncrypt(B.public_key, A.private_key, {
      Nb: NaNbX.Nb
    });
  });

  it("B decrypts Nb", async () => {
    let NbX = authDecrypt(A.public_key, B.private_key, message_3_NbForB);
    expect(NbX.Nb).toBe(Nb);

    // here B should use the resolver and confirm once again that
    // this message in particular is signed by a key held by A
    // B has authenticated A if this is true
  });
});
