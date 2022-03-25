const router = require('express').Router();
const controller = require('../../controllers/location');
const reviewController = require('../../controllers/review');

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
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           example: 37.5366059
 *           description: latitude of current location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           example: 126.9771397
 *           description: longitude of current location
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


/**
 *  @swagger
 *  paths:
 *   /search:
 *    get:
 *     tags:
 *     - Maps
 *     summary: location search list
 *     description: location list filtered by utility
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           description: requested page number
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           description: name of utility
 *           enum: ['toilet', 'charger', 'slope', 'elevator']
 *           example: toliet
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           example: 37.5366059
 *           description: latitude of current location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           example: 126.9771397
 *           description: longitude of current location
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationList'
 */
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

router.route('/:locationId/toilet')
    .get(controller.getToiletById);


/**
 * @swagger
 * paths:
 *  /{location_ID}/charger:
 *   get:
 *    tags:
 *    - Maps
 *    summary: charger detail
 *    description: get charger detail info by location Id
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
 *                  example: get charger info success
 *                data:
 *                  $ref: '#/components/schemas/Charger'
 */
router.route('/:locationId/charger')
    .get(controller.getChargerById);

/**
 * @swagger
 * paths:
 *  /{location_ID}/review:
 *   get:
 *    tags:
 *    - Maps
 *    summary: review list of the location
 *    description: get review list of the location
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
 *                  example: List Review of location number 1 Success
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Review'
 */
router.route('/:locationId/review')
    .get(reviewController.listByLocation);

/**
 *  @swagger
 *  paths:
 *   /{location_ID}/review/average:
 *    get:
 *     tags:
 *     - Maps
 *     summary: review count and average
 *     description: get count of review and average of review star rate
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 *                   description: count of review
 *                 average:
 *                   type: float
 *                   example: 4.5
 *                   description: average of review star rate
 */
router.route('/:locationId/review/average')
    .get(reviewController.getReviewNumberAndStarRateAverage);

module.exports = router;
