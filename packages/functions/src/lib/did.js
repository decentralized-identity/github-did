const ghdid = require('@github-did/lib');

const aliceDID = 'did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a';
const bobDID = 'did:ghdid:transmute-industries~github-did~f3b3f869f844ff1bc18b59b41d9064a792cc699d5512d8f98d75d5ece623b28c';
const serverDID = 'did:ghdid:transmute-industries~github-did~c9fbca5c875f02000e366d6a3be344ae9ae17d4fca255cca4f290e6e0ac56278';

const whitelist = [aliceDID, bobDID, serverDID];

const verifyInvocation = async (did) => {
  // check whitelist
  const capability = await ghdid.resolver.resolve(did);
  const capabilityCreator = capability.proof.creator.split('#')[0];
  if (whitelist.indexOf(capabilityCreator) === -1) {
    throw new Error('Creator is not whitelisted.');
  }
  // verify capability
  return ghdid.verify({
    data: capability,
  });
};

module.exports = {
  instanceDID: serverDID,
  whitelist,
  verifyInvocation,
  ...ghdid,
};
