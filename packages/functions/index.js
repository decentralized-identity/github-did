const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const winston = require('./src/lib/winston');
const { functions } = require('./src/lib/firebase');

const swagger = require('./src/express/swagger');

// TODO: for testing OpenID Connect.
// const passport = require('./src/express/passport');
// passport(app);

// Import error Handler.
const onErrorResponse = require('./src/express/onErrorResponse');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());
app.use(morgan('combined', { stream: winston.stream }));
app.options('*', cors({ origin: true }));

// Routes
app.use('/', require('./src/express/routes'));

swagger(app);

// Handle errors.
app.use(onErrorResponse);

// Expose Express API as a single Cloud Function:
exports.main = functions.https.onRequest(app);
