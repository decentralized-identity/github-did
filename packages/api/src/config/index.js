const functions = require('firebase-functions');

const getBaseConfig = () => {
  const config = functions.config();
  return config.github_did;
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
