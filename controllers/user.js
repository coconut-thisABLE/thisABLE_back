const httpStatus = require('http-status');
const { omit } = require('lodash')
const {User} = require('../models');


exports.signup = async (req, res, next) => {
  try {
    const userData = omit(req.body, 'repeat_pwd');
    const user = await new User(userData).save();
    // const token = generateTokenResponse(user, user.token());
    return res.status(httpStatus.CREATED).json({
      'message': 'User Registered Success. Welcome to thisABLE!',
    });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

exports.login = async (req, res, next) => {
  try {
    const {user, accessToken} = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({token, user: userTransformed});
  } catch (error) {
    return next(error);
  }
};
