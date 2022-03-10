const router = require('express').Router();
const controller = require('../../controllers/location');

router.route('')
    .get(controller.list);

module.exports = router;
