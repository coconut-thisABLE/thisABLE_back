const httpStatus = require('http-status');
const moment = require('moment-timezone');
const {omit} = require('lodash');
const {User, RefreshToken} = require('../models');
const {jwtExpirationInterval} = require('../config/vars');

/**
 * Returns a formated object with tokens
 * @param {Object} user
 * @param {String} accessToken
 * @return {Object}
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'JWT';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

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
    return res.status(httpStatus.CREATED).json({token, user: userTransformed});
  } catch (error) {
    return next(error);
  }
};
