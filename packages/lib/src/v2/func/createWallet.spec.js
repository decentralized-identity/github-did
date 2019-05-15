const createWallet = require("./createWallet");

describe("createWallet", () => {
  it("can create a did-wallet ", async () => {
    const wallet = await createWallet();
    expect(wallet.keys).toEqual({});
  });
});
