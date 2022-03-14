const router = require('express').Router();
const controller = require('../../controllers/location');

/**
 *  @swagger
 *  paths:
 *   /:
 *    get:
 *     tags:
 *     - Maps
 *     summary: location list
 *     description: location list (현재 위치 제외한 api 추후 수정 예정)
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           description: requested page number
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationList'
 */
router.route('')
    .get(controller.list)
    .post(controller.create);


router.route('/search')
    .get(controller.search);

/**
 * @swagger
 * paths:
 *  /{location_ID}:
 *   get:
 *    tags:
 *    - Maps
 *    summary: location detail
 *    description: location detail
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Retrieve Location By Id Success
 *                response:
 *                  $ref: '#/components/schemas/Location'
 */
router.route('/:locationId')
    .get(controller.get);

module.exports = router;
