const express = require('express');

const { getBasePath } = require('../../../config');

const ghdid = require('@github-did/lib');
const logger = require('../../../lib/winston');

const router = express.Router();

/**
 * @swagger
 *
 * paths:
 *   "/.well-known/webfinger":
 *     get:
 *       tags: [System]
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: query
 *         name: resource
 *         description: resource to check
 *         required: true
 *         type: string
 *         value: acct:did:github:OR13@github-did.com
 *       responses:
 *         '200':
 *           description: Webfinger Record
 *           type: object
 */
router.get('/', async (req, res, next) => {
  try {
    const { resource } = req.query;
    if (!resource || !resource.includes('acct:')) {
      return res.status(400).json({
        message:
          'Please make sure "acct:DID@DOMAIN" is what you are sending as the "resource" query parameter.',
      });
    }
    const [did, domain] = resource.replace('acct:', '').split('@');
    const didDocument = await ghdid.v2.func.resolver.resolve(did);
    if (!didDocument) {
      throw new Error('Webfinger could not resolve did.');
    }
    const result = {
      subject: `acct:${did}@${domain}`,
      links: [
        {
          rel: 'self',
          type: 'application/activity+json',
          href: `https://${domain}${getBasePath()}/did/${did}`,
        },
      ],
    };
    logger.info(`webfinger ${did}`);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
