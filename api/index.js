const router = require('express').Router();
const userRoutes = require('./routes/user');
const locationRoutes = require('./routes/location');
const reviewRoutes = require('./routes/review');
const chatBotRoutes = require('./routes/chatbot');

router.use('/user', userRoutes);
router.use('', locationRoutes);
router.use('/review', reviewRoutes);
router.use('/chatbot', chatBotRoutes);

module.exports = router;
