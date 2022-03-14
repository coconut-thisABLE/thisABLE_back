const router = require('express').Router();
const userRoutes = require('./routes/user');
const locationRoutes = require('./routes/location');


router.use('/user', userRoutes);
router.use('', locationRoutes);

module.exports = router;
