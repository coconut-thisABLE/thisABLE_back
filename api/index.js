const router = require('express').Router();
const userRoutes = require('./routes/user');
const locationRoutes = require('./routes/location');
const searchRoutes = require('./routes/search');


router.use('/user', userRoutes);
router.use('', locationRoutes);
router.use('/search', searchRoutes);

module.exports = router;
