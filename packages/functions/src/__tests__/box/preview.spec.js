const BoxSDK = require('box-node-sdk');
// eslint-disable-next-line
const boxConfig = require('../../../secrets/box.json');

const sdk = new BoxSDK({
  ...boxConfig.boxAppSettings,
});

const client = sdk.getAppAuthClient('enterprise', boxConfig.enterpriseID);

describe('box', () => {
  describe('preview', () => {
    // https://developer.box.com/docs/downscope-tokens
    it('can get a scoped preview token', async () => {
      const folderID = '63807364020';
      const scopes = 'base_explorer item_download';
      const resource = `https://api.box.com/2.0/folders/${folderID}`;

      // Perform token exchange to get downscoped token
      const { accessToken } = await client.exchangeToken(scopes, resource);
      expect(accessToken).toBeDefined();
    });
  });
});
