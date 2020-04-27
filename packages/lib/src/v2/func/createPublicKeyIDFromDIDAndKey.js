const createPublicKeyIDFromDIDAndKey = (did, key) => {
  return `${did}#${key.kid}`;
};

module.exports = createPublicKeyIDFromDIDAndKey;
