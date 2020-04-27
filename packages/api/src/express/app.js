const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const winston = require('../lib/winston');

const swagger = require('../express/swagger');

const app = express();

// Import error Handler.
const onErrorResponse = require('../express/onErrorResponse');

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());
app.use(morgan('combined', { stream: winston.stream }));
app.options('*', cors({ origin: true }));

// API Definition.
app.use('/api/v1/version', require('./routes/version'));
app.use('/api/v1/did', require('./routes/did'));
app.use(
  '/api/v1/.well-known/webfinger',
  require('./routes/.well-known/webfinger')
);
app.use('/.well-known/webfinger', require('./routes/.well-known/webfinger'));

swagger(app);

// Handle errors.
app.use(onErrorResponse);

// Expose Express API as a single Cloud Function:
module.exports = app;
