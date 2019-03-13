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

  return config.github_did || exampleConfig.github_did;
};

const getBaseHost = () => {
  switch (getBaseConfig().env) {
    case 'production':
      return 'github-did.com';
    default:
      return 'localhost:5000';
  }
};

const getBasePath = () => {
  switch (getBaseConfig().env) {
    case 'production':
      return '/api/v1';
    default:
      return `/${process.env.GCLOUD_PROJECT}/us-central1/${process.env.FUNCTION_NAME}/api/v1`;
  }
};

const getAPIBaseUrl = () => {
  const protocol = getBaseConfig().env === 'production' ? 'https' : 'http';
  return `${protocol}://${getBaseHost()}${getBasePath()}`;
};

module.exports = {
  getBaseConfig,
  getBaseHost,
  getBasePath,
  getAPIBaseUrl,
};
