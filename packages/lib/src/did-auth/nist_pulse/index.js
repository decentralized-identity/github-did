const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const moment = require("moment");

const getJson = async url => {
  // TODO: remove await
  const data = await (await fetch(url, {
    method: "get",
    headers: {
      Accept: "application/ld+json"
    }
  })).json();
  return data;
};

const isPulseValid = async pulse => {
  let pulseFromNist = await getJson(pulse.uri);
  const valuesMatch = pulseFromNist.pulse.outputValue === pulse.value;
  // TODO: check beacon signature here...
  // For now, we trust NIST.

  let timeStamp = pulseFromNist.pulse.timeStamp;
  // timeStamp = '2019-03-03T22:00:00.000Z'

  // make sure that we don't consider a pulse that is older than 1 hour valid.
  if (moment().isAfter(moment(timeStamp).add(1, "hour"))) {
    // pulse signature is expired.
    return false;
  }

  return valuesMatch;
};

const verify = async (tokenOrDoc, publicKey, ldSignatureSuites = {}) => {
  let payload;
  let signature;
  if (typeof tokenOrDoc === "string") {
    let decoded = jwt.decode(tokenOrDoc, { complete: true });
    payload = jwt.verify(tokenOrDoc, publicKey, {
      algorithm: decoded.header.alg
    });
    if (payload) {
      signature = true;
    }
  } else {
    const proof = tokenOrDoc.proof || tokenOrDoc.signature;
    if (!proof) {
      throw new Error("JSON-LD Signature is not spec compliant.");
    }
    if (!ldSignatureSuites[proof.type]) {
      throw new Error("JSON-LD Signature Suite not available.");
    }
    signature = await ldSignatureSuites[proof.type].verify({
      data: tokenOrDoc,
      publicKey
    });
    payload = tokenOrDoc;
  }
  const pulse = await isPulseValid(payload.did_auth_nist_pulse);
  return signature && pulse;
};

const getLastHourPulse = async () => {
  const lastPulse = await getJson(
    "https://beacon.nist.gov/beacon/2.0/pulse/last"
  );
  const lastHourPulse = lastPulse.pulse.listValues[1];
  return lastHourPulse;
};

module.exports = {
  verify,
  getLastHourPulse
};
