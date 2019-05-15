const createPublicKeyIDFromDIDAndKey = (did, key) => {
  return `${did}#kid=${key.kid}`;
};

module.exports = createPublicKeyIDFromDIDAndKey;
