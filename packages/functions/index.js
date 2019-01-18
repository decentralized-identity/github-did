const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const pack = require('./package.json');

const { functions } = require('./src/lib/firebase');

const { getBasePath } = require('./src/config');

const app = express();

// Import error Handler.
const onErrorResponse = require('./src/express/onErrorResponse');

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());
app.options('*', cors({ origin: true }));

// API Definition.
app.use('/v1/did', require('./src/express/routes/did'));
app.use('/v1/version', require('./src/express/routes/version'));

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
  apis: ['./src/express/routes/**/*/index.js'],
});

// 404 Middleware
const pageNotFound = (req, res, next) => {
  if (req.url !== '/docs') {
    res.status(404).send('Page not found');
  } else {
    next();
  }
};

// Swagger
app.use(swaggerUi.serve, pageNotFound, swaggerUi.setup(swaggerDoc));

// Handle errors.
app.use(onErrorResponse);

// Expose Express API as a single Cloud Function:
exports.API = functions.https.onRequest(app);
