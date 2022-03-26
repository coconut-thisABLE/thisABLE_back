const router = require('express').Router();
const controller = require('../../controllers/chatbot');

/**
  * @swagger
  * paths:
  *   /chatbot/textQuery:
  *     post:
  *       tags:
  *       - ChatBot
  *       summary: Test Dialogflow Query API
  *       requestBody:
  *         required: true
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 text:
  *                   type: string
  *                   example: test
  *                   required: true
  *       responses:
  *         200:
  *           description: Ok
  */
router.route('/textQuery')
    .post(controller.createTextQuery);

/**
  * @swagger
  * paths:
  *   /chatbot/eventQuery:
  *     post:
  *       tags:
  *       - ChatBot
  *       summary: Test Dialogflow Query API
  *       requestBody:
  *         required: true
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 event:
  *                   type: string
  *                   example: welcomeToMyWebsite
  *                   required: true
  *       responses:
  *         200:
  *           description: Ok
  */
router.route('/eventQuery')
    .post(controller.createEventQuery);

module.exports = router;
