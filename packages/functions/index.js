const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const winston = require('./src/lib/winston');

const { functions } = require('./src/lib/firebase');

const swagger = require('./src/express/swagger')

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

swagger(app);

// Handle errors.
app.use(onErrorResponse);

// Expose Express API as a single Cloud Function:
exports.main = functions.https.onRequest(app);
