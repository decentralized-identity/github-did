const express = require('express');

const router = express.Router();

// API Definition.

router.use('/api/v1/did-auth', require('./did-auth'));
router.use('/api/v1/version', require('./version'));
router.use('/api/v1/did', require('./did'));
router.use('/api/v1/.well-known/webfinger', require('./.well-known/webfinger'));
router.use('/.well-known/webfinger', require('./.well-known/webfinger'));

module.exports = router;
