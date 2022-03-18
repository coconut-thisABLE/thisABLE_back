const router = require('express').Router();
const {authorize, ANONYMOUS} = require('../middlewares/auth');
const controller = require('../../controllers/review');

router.route('')
    .post(authorize(ANONYMOUS), controller.create);

module.exports = router;
