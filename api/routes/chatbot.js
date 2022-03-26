const router = require('express').Router();
const controller = require('../../controllers/chatbot');

// Text Query Route
router.route('/textQuery')
    .post(controller.createTextQuery);

// Event Query Route
router.route('/eventQuery')
    .post(controller.createEventQuery);

module.exports = router;
