const router = require('express').Router();
const userRoutes = require('./routes/user');
const locationRoutes = require('./routes/location');
const reviewroutes = require('./routes/review');

router.use('/user', userRoutes);
router.use('', locationRoutes);
router.use('/review', reviewroutes);

module.exports = router;
