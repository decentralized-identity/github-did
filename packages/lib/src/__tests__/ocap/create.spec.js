const uuidv4 = require("uuid/v4");
const fse = require("fs-extra");
const path = require("path");

const ghdid = require("../../index");

const fixtures = require("../__fixtures__");

describe("ghdid", () => {
  it("create capability", async () => {
    const capability = fixtures.ocap.caps.capability;
    capability.id = ghdid.createDID(
      "ghdid",
      "transmute-industries",
      "github-did",
      uuidv4()
    );
    capability.parentCapability = fixtures.ocap.dids.server.didDocument.id;
    capability.invoker = fixtures.ocap.dids.alice.didDocument.publicKey[0].id;
    const signed = await ghdid.sign({
      data: capability,
      creator: fixtures.ocap.dids.server.didDocument.publicKey[0].id,
      privateKey: await ghdid.getUnlockedPrivateKey(
        fixtures.ocap.dids.server.wallet.data.keystore[
          fixtures.ocap.dids.server.didDocument.publicKey[0].id.split(
            "#kid="
          )[1]
        ].data.privateKey,
        "password"
      )
    });
    // await fse.outputFile(
    //   path.resolve(__dirname, "./__fixtures__/ocap/caps/capability.json"),
    //   JSON.stringify(signed, null, 2)
    // );
  });

  it("create delegation", async () => {
    const capability = fixtures.ocap.caps.capability;
    const delegation = fixtures.ocap.caps.delegation;
    delegation.id = ghdid.createDID(
      "ghdid",
      "transmute-industries",
      "github-did",
      uuidv4()
    );
    delegation.parentCapability = capability.id;
    delegation.invoker = fixtures.ocap.dids.bob.didDocument.publicKey[0].id;
    delegation.caveat = [];
    const signed = await ghdid.sign({
      data: delegation,
      creator: fixtures.ocap.dids.alice.didDocument.publicKey[0].id,
      privateKey: await ghdid.getUnlockedPrivateKey(
        fixtures.ocap.dids.alice.wallet.data.keystore[
          fixtures.ocap.dids.alice.didDocument.publicKey[0].id.split("#kid=")[1]
        ].data.privateKey,
        "password"
      )
    });
    // await fse.outputFile(
    //   path.resolve(__dirname, "./__fixtures__/ocap/caps/delegation.json"),
    //   JSON.stringify(signed, null, 2)
    // );
  });

  it("create invocation", async () => {
    const delegation = fixtures.ocap.caps.delegation;
    const invocation = fixtures.ocap.caps.invocation;
    invocation.id = ghdid.createDID(
      "ghdid",
      "transmute-industries",
      "github-did",
      uuidv4()
    );
    invocation.action = "upload";
    invocation.capability = delegation.id;

    const signed = await ghdid.sign({
      data: invocation,
      creator: fixtures.ocap.dids.bob.didDocument.publicKey[0].id,
      privateKey: await ghdid.getUnlockedPrivateKey(
        fixtures.ocap.dids.bob.wallet.data.keystore[
          fixtures.ocap.dids.bob.didDocument.publicKey[0].id.split("#kid=")[1]
        ].data.privateKey,
        "password"
      )
    });
    // await fse.outputFile(
    //   path.resolve(__dirname, "./__fixtures__/ocap/caps/invocation.json"),
    //   JSON.stringify(signed, null, 2)
    // );
  });

});
