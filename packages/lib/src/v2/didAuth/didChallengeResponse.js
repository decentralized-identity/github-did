const crypto = require("crypto");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const generateChallenge = () => {
  return {
    nonce: crypto.randomBytes(32).toString("hex"),
    expires: moment()
      .add(1, "hour")
      .toISOString()
  };
};

const validateToken = async (token, publicKey) => {
  let decoded = jwt.decode(token, { complete: true });
  return jwt.verify(token, publicKey, {
    algorithm: decoded.header.alg
  });
};

const validateSignature = async (doc, publicKey, ldSignatureSuites) => {
  const proof = doc.proof || doc.signature;
  if (!proof) {
    throw new Error("JSON-LD Signature is not spec compliant.");
  }
  if (!ldSignatureSuites[proof.type]) {
    throw new Error("JSON-LD Signature Suite not available.");
  }
  const isSignatureValid = await ldSignatureSuites[proof.type].verify({
    data: doc,
    publicKey: publicKey
  });

  return isSignatureValid;
};

const verifySignedChallenge = async (
  tokenOrDoc,
  initiatorPublicKey,
  responderPublicKey,
  ldSignatureSuites = {}
) => {
  let payload;
  let challengerSignatureIsValid = false;
  let responderSignatureIsValid = false;

  if (typeof tokenOrDoc === "string") {
    let decoded = await validateToken(tokenOrDoc, responderPublicKey);
    responderSignatureIsValid = !!decoded;
    decoded = await validateToken(
      decoded.did_auth_challenge,
      initiatorPublicKey
    );
    challengerSignatureIsValid = !!decoded;
    payload = decoded;
  } else {
    responderSignatureIsValid = await validateSignature(
      tokenOrDoc,
      responderPublicKey,
      ldSignatureSuites
    );

    challengerSignatureIsValid = await validateSignature(
      tokenOrDoc.did_auth_challenge,
      initiatorPublicKey,
      ldSignatureSuites
    );
    payload = tokenOrDoc.did_auth_challenge;
  }

  if (moment().isAfter(moment(payload.expires))) {
    // challenge is expired
    return false;
  }

  if (responderSignatureIsValid && challengerSignatureIsValid) {
    // success
    return true;
  }

  return false;
};

module.exports = {
  verifySignedChallenge,
  generateChallenge
};
