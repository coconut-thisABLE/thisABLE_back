const router = require('express').Router();
const oAuthLogin = require('../middlewares/auth').oAuth;
const controller = require('../../controllers/user');

/**
  * @swagger
  * paths:
  *   /user/signup:
  *     post:
  *       tags:
  *       - Auth
  *       summary: signup
  *       requestBody:
  *         required: true
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 email:
  *                   type: string
  *                   format: email
  *                   description: unique email of user
  *                   example: test@thisable.com
  *                 password:
  *                   type: string
  *                   description: password
  *                   example: example
  *                 repeat_pwd:
  *                   type: string
  *                   description: confirmed password
  *                   example: example
  *                 type:
  *                   type: string
  *                   description: type of user
  *                   enum: ['abled', 'disabled']
  *                   example: 'disabled'
  *       responses:
  *         201:
  *           description: Created
  *           content:
  *             application/json:
  *               type: object
  *               schema:
  *                 properties:
  *                   message:
  *                     type: string
  *                     example: 'User Registered Success. Welcome to thisABLE!'
  *         400:
  *           description: Duplicate Email
  *           content:
  *             application/json:
  *               schema:
  *                 type: object
  *                 properties:
  *                   code:
  *                     type: integer
  *                     example: 400
  *                   message:
  *                       type: string
  *                       example: 'Validation Error'
  *                   errors:
  *                     type: array
  *                     items:
  *                       type: object
  *                       properties:
  *                         field:
  *                           type: string
  *                           example: email
  *                         location:
  *                           type: string
  *                           example: body
  *                         messages:
  *                           type: array
  *                           example: ["\"email\" already exists"]
  */
router.route('/signup')
    .post(controller.signup);

/**
  *  @swagger
  *  paths:
  *    /user/login:
  *      post:
  *        tags:
  *        - Auth
  *        summary: login
  *        requestBody:
  *          required: true
  *          content:
  *            application/json:
  *              schema:
  *                type: object
  *                properties:
  *                  email:
  *                    type: string
  *                    format: email
  *                    description: unique email of user
  *                    example: test@thisable.com
  *                  password:
  *                    type: string
  *                    description: password
  *                    example: example
  *        responses:
  *          201:
  *            description: Created
  *            content:
  *              application/json:
  *                schema:
  *                  type: object
  *                  properties:
  *                    token:
  *                      type: object
  *                      properties:
  *                        tokenType:
  *                          type: string
  *                          description: authorization type
  *                          enum: ['JWT']
  *                        accessToken:
  *                          type: string
  *                          description: access token
  *                          example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDc2Mjg4NTQsImlhdCI6MTY0NzYyNzk1NCwic3ViIjoiNjIzNGNjZDM3ODk5NGRhZGI3YjRlNjE5In0.CdA1A_jXfiZEr2edx_cAKGrPGztej6o1TNFNBWh5AfY'
  *                        refreshToken:
  *                          type: string
  *                          description: refresh token
  *                          example: '6234ccd378994dadb7b4e619.2c630a550233d030b5c6f31da4a5a8ef55843ce27f7c8c2089acf2535f929c60ab2eb8619745a22f'
  *                        expiresIn:
  *                          type: string
  *                          format: datetime
  *                          example: '2022-03-18T18:40:54.330Z'
  *                    user:
  *                      type: object
  *                      properties:
  *                        _id:
  *                          type: string
  *                          description: user unique id
  *                          example: '6234ccd378994dadb7b4e619'
  *                        email:
  *                          type: string
  *                          format: email
  *                          description: user unique email
  *                          exmpale: 'test@test.com'
  *                        type:
  *                          type: string
  *                          enum: ['abled', 'disabled']
  *                          example: 'disabled'
 */
router.route('/login')
    .post(controller.login);

router.route('/google')
    .post(oAuthLogin('google'), controller.oAuth);
module.exports = router;
