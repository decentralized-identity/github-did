const ghdid = require("../ghdid");

const openpgp = require("@transmute/openpgpsignature2019/node_modules/openpgp");
const {
  constructDIDPublicKeyID,
  DIDLinkedDataSignatureVerifier
} = require("@transmute/transmute-did");
const OpenPgpSignature2019 = require("@transmute/openpgpsignature2019");

const fixtures = require("./__fixtures__");

describe("ghdid", () => {
  const wallet = fixtures.wallet;
  const kid = Object.keys(wallet.data.keystore)[0];
  let privateKey;
  beforeAll(async () => {
    privateKey = (await openpgp.key.readArmored(
      wallet.data.keystore[kid].data.privateKey
    )).keys[0];
    await privateKey.decrypt(fixtures.passphrase);
  });

  // leave for debugging / coverage
  // it("can create a wallet", async () => {
  //   wallet = await ghdid.createDIDWallet({
  //     email: fixtures.email,
  //     passphrase: fixtures.passphrase
  //   });
  //   // // eslint-disable-next-line
  //   kid = Object.keys(wallet.data.keystore)[0];
  //   console.log(JSON.stringify(wallet.data, null, 2));
  // });

  it("supports ghdid transforms", async () => {
    const did = ghdid.createDID(
      "ghdid",
      "transmute-industries",
      "github-did",
      kid
    );
    expect(did).toEqual(
      "did:ghdid:transmute-industries~github-did~8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e"
    );
    const didDocumentUrl = ghdid.didToDIDDocumentURL(did);
    expect(didDocumentUrl).toEqual(
      "https://raw.githubusercontent.com/transmute-industries/github-did/master/dids/8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e.jsonld"
    );
  });

  it("can create a DID Document", async () => {
    const result = await fixtures.wallet.toDIDDocument({
      did: ghdid.createDID("ghdid", "transmute-industries", "github-did", kid),
      cacheLocal: true
    });
    didDocument = result.data;
    expect(didDocument.publicKey[0].type).toBe("OpenPgpSignature2019");
    expect(fixtures.didDocument.id).toBe(didDocument.id);
  });

  it("can sign and verify DID Document", async () => {
    const signed = await OpenPgpSignature2019.sign({
      data: fixtures.didDocument,
      domain: "github-did",
      signatureAttribute: "proof",
      // compact: true,
      creator: constructDIDPublicKeyID(fixtures.didDocument.id, kid),
      privateKey
    });

    const verified = await OpenPgpSignature2019.verify({
      data: signed,
      signatureAttribute: "proof",
      publicKey: wallet.data.keystore[kid].data.publicKey
    });
    expect(signed.proof.domain).toBe("github-did");
    expect(verified).toBe(true);
  });

  it("can verify with resolver", async () => {
    const verified = await DIDLinkedDataSignatureVerifier.verifyLinkedDataWithDIDResolver(
      {
        data: fixtures.didDocumentWithProof,
        resolver: wallet.resolver,
        verify: ({ data, publicKey }) => {
          return OpenPgpSignature2019.verify({
            data,
            signatureAttribute: "proof",
            publicKey
          });
        }
      }
    );
    expect(verified).toBe(true);
  });

  it("fails to verify when a key is revoked (removed from DID Document)", async () => {
    expect.assertions(1);

    // delete keystore
    wallet.data.keystore = {};
    await wallet.toDIDDocument({
      did: fixtures.didDocument.id,
      cacheLocal: true
    });

    try {
      await DIDLinkedDataSignatureVerifier.verifyLinkedDataWithDIDResolver({
        data: fixtures.didDocumentWithProof,
        resolver: wallet.resolver,
        verify: ({ data, publicKey }) => {
          return OpenPgpSignature2019.verify({
            data,
            signatureAttribute: "proof",
            publicKey
          });
        }
      });
    } catch (e) {
      expect(e.message).toBe(
        "Creator key is not present in resolved DID Document. Catch this error and consider the key revoked."
      );
    }
  });
});
