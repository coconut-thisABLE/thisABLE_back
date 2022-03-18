const router = require('express').Router();
const controller = require('../../controllers/user');


router.route('/signup')
    .post(controller.signup);

router.route('/login')
    .post(controller.login);

module.exports = router;
