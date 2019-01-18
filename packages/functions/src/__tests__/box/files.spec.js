const fs = require('fs');
const path = require('path');
const BoxSDK = require('box-node-sdk');
// eslint-disable-next-line
const boxConfig = require('../../../secrets/box.json');

const sdk = new BoxSDK({
  ...boxConfig.boxAppSettings,
});

const client = sdk.getAppAuthClient('enterprise', boxConfig.enterpriseID);

describe('box', () => {
  describe('files', () => {
    // it('upload test doc', async () => {
    //   const folderID = '63807364020';
    //   const fileName = 'steele-dossier.pdf';
    //   const fileContents = fs.readFileSync(
    //     path.resolve(__dirname, '../../../../../data/steele-dossier.pdf'),
    //   );
    //   await client.files.uploadFile(folderID, fileName, fileContents);
    // });

    it(
      'client can create, read, update and delete',
      async () => {
        const folderID = '63807364020';
        const fileName = 'project-proposal.pdf';
        // eslint-disable-next-line
        const fileContents = fs.readFileSync(
          path.resolve(__dirname, '../../../../../data/project-proposal.pdf'),
        );
        // upload file
        const result = await client.files.uploadFile(folderID, fileName, fileContents);
        expect(result.total_count).toBe(1);
        const fileID = result.entries[0].id;
        // get files info
        const file = await client.files.get(fileID);
        expect(file.name).toBe(fileName);

        // upload file version
        // eslint-disable-next-line
        const revisedFileContents = fs.readFileSync(
          path.resolve(__dirname, '../../../../../data/steele-dossier.pdf'),
        );
        await client.files.uploadNewFileVersion(fileID, revisedFileContents);

        // delete file
        await client.files.delete(fileID);
      },
      10 * 1000,
    );
  });
});
