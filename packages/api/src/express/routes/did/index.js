const express = require('express');
const ghdid = require('@github-did/lib');

const router = express.Router();

/* eslint-disable max-len */
/**
 * @swagger
 *
 * paths:
 *   "/did/{did}":
 *     get:
 *       description: Resolve a DID
 *       tags: [DID]
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: path
 *         name: did
 *         description: DID to resolve
 *         required: true
 *         type: string
 *         value: did:github:OR13
 *       responses:
 *         '200':
 *           description: DID Document
 *           type: object
 */
/* eslint-enable max-len */
router.get('/:did', async (req, res, next) => {
  try {
    const result = {
      ...(await ghdid.v2.func.resolver.resolve(req.params.did)),
    };
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
