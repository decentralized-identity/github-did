const express = require('express');
const didLib = require('../../../lib/did');

const router = express.Router();

/**
 * @swagger
 *
 * paths:
 *   "/did":
 *     get:
 *       description: DID Document for this Domain
 *       tags: [DID]
 *       produces:
 *       - application/json
 *       responses:
 *         '200':
 *           description: DID Document
 *           type: object
 */
router.get('/', async (req, res, next) => {
  try {
    const result = {
      ...(await didLib.resolver.resolve(didLib.instanceDID)),
    };
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

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
 *         value: did:ghdid:transmute-industries~github-did~f3b3f869f844ff1bc18b59b41d9064a792cc699d5512d8f98d75d5ece623b28c
 *       responses:
 *         '200':
 *           description: DID Document
 *           type: object
 */
/* eslint-enable max-len */
router.get('/:did', async (req, res, next) => {
  try {
    const result = {
      ...(await didLib.resolver.resolve(req.params.did)),
    };
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
