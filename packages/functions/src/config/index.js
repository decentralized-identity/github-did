const functions = require('firebase-functions');
const fs = require('fs');

const exampleConfigPath = './example.runtimeconfig.json';
const localConfig = '../../secrets/.runtimeconfig.json';

// eslint-disable-next-line
const exampleConfig = require(exampleConfigPath);

const getBaseConfig = () => {
  let config = functions.config();

  // eslint-disable-next-line
  if (fs.existsSync(localConfig)) {
    // eslint-disable-next-line
    config = require(localConfig);
  }

  return config.did_box || exampleConfig.did_box;
};

const getBaseHost = () => {
  switch (getBaseConfig().env) {
    case 'staging':
      return 'us-central1-did-box.cloudfunctions.net';
    case 'local':
    default:
      return 'localhost:5000';
  }
};

const getBasePath = () => {
  switch (getBaseConfig().env) {
    case 'production':
      return '/v1/';
    case 'local':
    default:
      return `/${process.env.GCLOUD_PROJECT}/us-central1/${process.env.FUNCTION_NAME}/v1/`;
  }
};

module.exports = {
  getBaseConfig,
  getBaseHost,
  getBasePath,
};
