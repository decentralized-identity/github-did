const express = require('express');
const packageJson = require('../../../../package.json');
const { getBaseConfig } = require('../../../config');

const { commit } = getBaseConfig();
const router = express.Router();

/**
 * @swagger
 *
 * paths:
 *   "/version":
 *     get:
 *       tags: [System]
 *       produces:
 *       - application/json
 *       responses:
 *         '200':
 *           description: successful response
 *           type: object
 *           properties:
 *             version:
 *               type: string
 *               example: 0.1.2
 *             commit:
 *               type: string
 *               example: 10512b16efa6f0c4e2b8ed64546bfaf8a17af8da
 */
router.get('/', async (req, res, next) => {
  try {
    const result = {
      version: packageJson.version,
      commit,
    };
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
