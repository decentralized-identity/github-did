const express = require('express');
const didLib = require('../../../lib/did');
const { getBasePath } = require('../../../config');

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
 *         value: acct:did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a@github-did.com
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
    const didDocument = await didLib.resolver.resolve(did);
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
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
