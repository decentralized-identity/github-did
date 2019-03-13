const express = require('express');

const router = express.Router();

/**
 * @swagger
 *
 * paths:
 *   "/did-auth/needham-schroeder":
 *     get:
 *       tags: [DID Auth]
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
router.get('/needham-schroeder', async (req, res, next) => {
  // TODO: provide example over http.
  try {
    const result = {};
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
