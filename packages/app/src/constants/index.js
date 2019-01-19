const aliceDID = 'did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a';
const bobDID = 'did:ghdid:transmute-industries~github-did~f3b3f869f844ff1bc18b59b41d9064a792cc699d5512d8f98d75d5ece623b28c';
const serverDID = 'did:ghdid:transmute-industries~github-did~c9fbca5c875f02000e366d6a3be344ae9ae17d4fca255cca4f290e6e0ac56278';

export const namedWhitelist = [
  {
    name: 'alice',
    did: aliceDID,
  },
  {
    name: 'bob',
    did: bobDID,
  },
  {
    name: 'server',
    did: serverDID,
  },
];

export const whitelist = namedWhitelist.map(item => item.did);

export default {
  aliceDID,
  bobDID,
  serverDID,
  namedWhitelist,
};
