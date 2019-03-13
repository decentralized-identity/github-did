const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const encrypt = (publicKey, dataBuffer) => {
  const encrypted = crypto
    .publicEncrypt(publicKey, dataBuffer)
    .toString("base64");
  return encrypted;
};

const decrypt = (privateKey, base64EncodedBuffer) => {
  const plaintext = crypto.privateDecrypt(
    privateKey,
    Buffer.from(base64EncodedBuffer, "base64")
  );
  return JSON.parse(plaintext);
};

const auth_encrypt = (publicKey, privateKey, payload) => {
  const token = jwt.sign(
    {
      encrypted: encrypt(publicKey, Buffer.from(JSON.stringify(payload)))
    },
    privateKey,
    { algorithm: "RS256" }
  );
  return token;
};

const auth_decrypt = (publicKey, privateKey, token) => {
  const decoded = jwt.verify(token, publicKey);
  const decrypted = decrypt(privateKey, decoded.encrypted);
  return decrypted;
};

module.exports = {
  auth_encrypt,
  auth_decrypt
};
