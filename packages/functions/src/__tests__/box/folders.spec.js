const BoxSDK = require('box-node-sdk');
// eslint-disable-next-line
const boxConfig = require('../../../secrets/box.json');

const sdk = new BoxSDK({
  ...boxConfig.boxAppSettings,
});

const client = sdk.getAppAuthClient('enterprise', boxConfig.enterpriseID);

describe('box', () => {
  describe('folders', () => {
    it(
      'can get a folder id by name',
      async () => {
        const folderName = 'did:ghdid:transmute-industries~github-did~f3b3f869f844ff1bc18b59b41d9064a792cc699d5512d8f98d75d5ece623b28c';
        const results = await client.search.query(folderName, {
          fields: 'name,modified_at,size,extension,permissions,sync_state',
          limit: 1,
          offset: 0,
        });
        expect(results.entries[0].type).toBe('folder');
        expect(results.entries[0].id).toBe('63807364020');
      },
      10 * 1000,
    );
    // eslint-disable-next-line
    it.skip('client can create, read, update and delete', async () => {
      const rootFolderID = 0;
      const childFolderName = 'root';
      // everything always has a root folder with id 0
      let rootFolder = await client.folders.get(rootFolderID);
      expect(rootFolder.item_collection.total_count).toBe(0);
      // when we create a folder, it always has a parent, the highest parent is folderID=0
      let childFolder = await client.folders.create(rootFolderID, childFolderName);
      expect(childFolder.type).toBe('folder');
      expect(childFolder.name).toBe(childFolderName);
      // creating a folder increases the item count of its parent.
      rootFolder = await client.folders.get(rootFolderID);
      expect(rootFolder.item_collection.total_count).toBe(1);
      // we can get a child folder by its id
      childFolder = await client.folders.get(childFolder.id);
      expect(childFolder.type).toBe('folder');
      expect(childFolder.name).toBe(childFolderName);
      // we can delete a child folder by its id
      const result = await client.folders.delete(childFolder.id, { recursive: true });
      expect(result).toBeUndefined();
      // deleting a child folder decreates its parent item count
      rootFolder = await client.folders.get(rootFolderID);
      expect(rootFolder.item_collection.total_count).toBe(0);
      // we cannot delete the root folder with id 0
      try {
        await client.folders.delete(rootFolderID, { recursive: true });
      } catch (e) {
        expect(e.response.body.code).toBe('access_denied_insufficient_permissions');
      }
    });
  });
});
