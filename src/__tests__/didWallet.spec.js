const ghdid = require("../ghdid");

const OpenPgpSignature2019 = require("@transmute/openpgpsignature2019");
const openpgp = require("openpgp");

const fixtures = require("./__fixtures__");
const kid = Object.keys(fixtures.wallet.data.keystore)[0];

const {
  constructDIDPublicKeyID,
  DIDLinkedDataSignatureVerifier
} = require("@transmute/transmute-did");

describe("ghdid", () => {
  it("can create a wallet", async () => {
    const newWallet = await ghdid.createDIDWallet({
      email: fixtures.email,
      passphrase: fixtures.passphrase
    });
    expect(newWallet).toBeDefined();
  });

  it("can sign and verify DID Document", async () => {
    const signed = await ghdid.sign({
      data: fixtures.didDocument,
      creator: fixtures.ocap.dids.alice.didDocument.publicKey[0].id,
      privateKey: await ghdid.getUnlockedPrivateKey(
        fixtures.ocap.dids.alice.wallet.data.keystore[
          fixtures.ocap.dids.alice.didDocument.publicKey[0].id.split("#kid=")[1]
        ].data.privateKey,
        "password"
      )
    });
    const verified = await ghdid.verify({
      data: signed
    });
    expect(signed.proof.domain).toBe("github-did");
    expect(verified).toBe(true);
  });

  it("can handle unlocked private keys without error", async () => {
    const privateKey = (await openpgp.key.readArmored(
      fixtures.wallet.data.keystore[kid].data.privateKey
    )).keys[0];
    await privateKey.decrypt(fixtures.passphrase);

    const signed = await ghdid.sign({
      data: fixtures.didDocument,
      creator: fixtures.ocap.dids.alice.didDocument.publicKey[0].id,
      privateKey: await ghdid.getUnlockedPrivateKey(
        privateKey.armor(),
        fixtures.passphrase
      )
    });
    expect(signed.toBeDefined);
  });

  it("can verify with wallet resolver", async () => {
    // add did to local cache
    await fixtures.wallet.toDIDDocument({
      did: fixtures.didDocument.id,
      cacheLocal: true
    });
    const verified = await DIDLinkedDataSignatureVerifier.verifyLinkedDataWithDIDResolver(
      {
        data: fixtures.didDocumentWithProof,
        resolver: fixtures.wallet.resolver,
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

    const backupKeyStore = { ...fixtures.wallet.data.keystore };
    // delete keystore
    fixtures.wallet.data.keystore = {};
    await fixtures.wallet.toDIDDocument({
      did: fixtures.didDocument.id,
      cacheLocal: true
    });

    try {
      await DIDLinkedDataSignatureVerifier.verifyLinkedDataWithDIDResolver({
        data: fixtures.didDocumentWithProof,
        resolver: fixtures.wallet.resolver,
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
    fixtures.wallet.data.keystore = backupKeyStore;
  });

  it("can encrypt and decrypt", async () => {
    const password = "local wallet password";
    await fixtures.wallet.encrypt(password);
    expect(fixtures.wallet.data.keystore.encrypted).toBeDefined();
    await fixtures.wallet.decrypt(password);
    expect(fixtures.wallet.data.keystore.encrypted).toBeUndefined();
  });
});
