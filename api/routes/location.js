const router = require('express').Router();
const controller = require('../../controllers/location');

router.route('')
    .get(controller.list);

router.route('/:locationId')
    .get(controller.get);

module.exports = router;
