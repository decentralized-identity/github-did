const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const pack = require('../../package.json');

const { getBasePath, getBaseConfig, getAPIBaseUrl } = require('../config');

module.exports = (app) => {
  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerDoc = swaggerJSDoc({
    definition: {
      info: {
        title: 'GitHub DID',
        version: pack.version,
        description: 'GitHub DID API',
      },
      basePath: getBasePath(),
    },
    // Path to the API docs
    apis: ['./src/express/routes/**/*/index.js', './src/express/routes/.well-known/webfinger.js'],
  });

  app.get('/api/v1/swagger.json', (req, res) => {
    res.json(swaggerDoc);
  });

  // 404 Middleware
  const pageNotFound = (req, res, next) => {
    if (['/', '/docs', '/api/docs'].indexOf(req.url) === -1) {
      res.status(404).json({
        message: 'GitHub DID API endpoint not found',
        url: req.url,
      });
    } else {
      next();
    }
  };

  // Swagger
  app.use(
    getBaseConfig().env === 'production' ? '/api/docs' : '/',
    swaggerUi.serve,
    pageNotFound,
    swaggerUi.setup(null, {
      swaggerUrl: `${getAPIBaseUrl()}/swagger.json`,
      explorer: true,
    }),
  );
};
