const resolver = require("./resolver");

describe("resolver", () => {
  it("can use resolver", async () => {
    const doc = await resolver.resolve("did:github:OR13");
    expect(doc.id).toBe("did:github:OR13");
  });
});
