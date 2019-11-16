const fs = require("fs");
const path = require("path");
const firebase = require("firebase");
const firebaseAdmin = require("firebase-admin");
const firebaseFunctions = require("firebase-functions");

const config = {
  apiKey: "AIzaSyAVl632H0LLkt7nezpWwMlxkynL26JH5eY",
  authDomain: "github-did.firebaseapp.com",
  databaseURL: "https://github-did.firebaseio.com",
  projectId: "github-did",
  storageBucket: "github-did.appspot.com",
  messagingSenderId: "798179370760"
};

let serviceAccountKey = false;
const serviceAccountPath = path.resolve(
  __dirname,
  "../../firebase-adminsdk.json"
);
// eslint-disable-next-line security/detect-non-literal-fs-filename
if (fs.existsSync(serviceAccountPath)) {
  /* eslint-disable max-len */
  // eslint-disable-next-line import/no-dynamic-require,global-require,security/detect-non-literal-require
  serviceAccountKey = require(serviceAccountPath);
}
if (!firebase.apps.length) {
  // config for logging in with email/password
  firebase.initializeApp(config);
  // config for verifying an existing access token
  firebaseAdmin.initializeApp({
    credential: serviceAccountKey
      ? firebaseAdmin.credential.cert(serviceAccountKey)
      : firebaseAdmin.credential.applicationDefault(),
    databaseURL: config.databaseURL
  });
}

const auth = firebase.auth();
const authAdmin = firebaseAdmin.auth();
// const db = firebaseAdmin.database();

module.exports = {
  auth,
  authAdmin,
  // db,
  functions: firebaseFunctions
};
