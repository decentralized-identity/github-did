const jwt = require("jsonwebtoken");

const { private_key, public_key } = require("../__fixtures__");

describe("jwt.sanity.spec", () => {
  it("can sign and verify", async () => {
    const payload = { user: "me" };
    const token = jwt.sign(payload, private_key, { algorithm: "RS256" });
    const res = jwt.verify(token, public_key, { algorithm: "RS256" });
    expect(payload.user).toEqual(res.user);
  });
});
