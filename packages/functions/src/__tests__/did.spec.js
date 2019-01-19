const didLib = require('../lib/did');

describe('did', () => {
  it('has constants', async () => {
    expect(didLib.instanceDID).toBeDefined();
  });
});
