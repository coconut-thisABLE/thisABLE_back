const router = require('express').Router();
const {authorize, ANONYMOUS} = require('../middlewares/auth');
const controller = require('../../controllers/review');
const {required} = require('joi');


/**
  * @swagger
  * paths:
  *   /review:
  *     post:
  *       tags:
  *       - Review
  *       summary: register new review
  *       parameters:
  *         - in: query
  *           name: Authorization
  *           required: false
  *           schema:
  *             type: string
  *             description: authorization token
  *             example: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDc2Mjg4NTQsImlhdCI6MTY0NzYyNzk1NCwic3ViIjoiNjIzNGNjZDM3ODk5NGRhZGI3YjRlNjE5In0.CdA1A_jXfiZEr2edx_cAKGrPGztej6o1TNFNBWh5AfY'
  *             refreshToken: '6234ccd378994dadb7b4e619.2c630a550233d030b5c6f31da4a5a8ef55843ce27f7c8c2089acf2535f929c60ab2eb8619745a22f'
  *       requestBody:
  *         required: true
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 locationId:
  *                   type: integer
  *                   description: unique id of location
  *                   required: true
  *                   example: 1
  *                 detail:
  *                   type: string
  *                   description: detail review content
  *                   required: true
  *                   example: 'The Elevator in the building is very narrow'
  *                 stare:
  *                   type: number
  *                   format: float
  *                   description: star rate of review
  *                   example: 3.5
  *       responses:
  *         201:
  *           description: Created
  *           content:
  *             application/json:
  *               schema:
  *                 type: object
  *                 properties:
  *                   message:
  *                     type: string
  *                     example: 'Create new review Success'
  */
router.route('')
    .post(authorize(ANONYMOUS), controller.create);

/**
  * @swagger
  * paths:
  *   /review/recommend:
  *     post:
  *       tags:
  *       - Review
  *       summary: recommend the review
  *       requestBody:
  *         required: true
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 reviewId:
  *                   type: string
  *                   description: unique id of review
  *                   required: true
  *                   example: 6234df9444b537fddcca769d
  *       responses:
  *         201:
  *           description: Created
  *           content:
  *             application/json:
  *               schema:
  *                 type: object
  *                 properties:
  *                   message:
  *                     type: string
  *                     example: 'success'
  */
router.route('/recommend')
    .post(authorize(ANONYMOUS), controller.recommend);

/**
  * @swagger
  * paths:
  *   /review/discourage:
  *     post:
  *       tags:
  *       - Review
  *       summary: discourage the review
  *       requestBody:
  *         required: true
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 reviewId:
  *                   type: string
  *                   description: unique id of review
  *                   required: true
  *                   example: 6234df9444b537fddcca769d
  *       responses:
  *         201:
  *           description: Created
  *           content:
  *             application/json:
  *               schema:
  *                 type: object
  *                 properties:
  *                   message:
  *                     type: string
  *                     example: 'success'
  */
router.route('/discourage')
    .post(authorize(ANONYMOUS), controller.discourage);

module.exports = router;
