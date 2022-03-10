const router = require('express').Router();
const controller = require('../../controllers/search');

router.route('/toilet')
    .get(controller.toiletList);
router.route('/charger')
    .get(controller.chargerList);
router.route('/elevator')
    .get(controller.elevatorList);
router.route('/slope')
    .get(controller.slopeList);
module.exports = router;
