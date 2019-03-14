const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const winston = require('./src/lib/winston');

const pack = require('./package.json');

const { functions } = require('./src/lib/firebase');

const { getBasePath, getBaseConfig } = require('./src/config');

const app = express();

// Import error Handler.
const onErrorResponse = require('./src/express/onErrorResponse');

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());
app.use(morgan('combined', { stream: winston.stream }));
app.options('*', cors({ origin: true }));

// API Definition.
app.use('/api/v1/version', require('./src/express/routes/version'));
app.use('/api/v1/did', require('./src/express/routes/did'));
app.use('/api/v1/.well-known/webfinger', require('./src/express/routes/.well-known/webfinger'));
app.use('/.well-known/webfinger', require('./src/express/routes/.well-known/webfinger'));

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerDoc = swaggerJSDoc({
  definition: {
    info: {
      title: 'Github DID',
      version: pack.version,
      description: 'Github DID API',
    },
    basePath: getBasePath(),
  },
  // Path to the API docs
  apis: ['./src/express/routes/**/*/index.js', './src/express/routes/.well-known/webfinger.js'],
});

// 404 Middleware
const pageNotFound = (req, res, next) => {
  if (['/', '/docs', '/api/docs'].indexOf(req.url) === -1) {
    res.status(404).json({
      message: 'Github DID API endpoint not found',
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
  swaggerUi.setup(swaggerDoc, {
    explorer: true,
  }),
);

// Handle errors.
app.use(onErrorResponse);

// Expose Express API as a single Cloud Function:
exports.main = functions.https.onRequest(app);
