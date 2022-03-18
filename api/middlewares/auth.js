const httpStatus = require('http-status');
const passport = require('passport');
const util = require('util');
const User = require('../../models/User');
const APIError = require('../../errors/api-error');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';
const ANONYMOUS = 'anonymous';

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const logIn = util.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  if (roles === ANONYMOUS && !user) {
    req.user = null;
    return next();
  }

  try {
    if (error || !user) throw error;
    await logIn(user, {session: false});
  } catch (e) {
    return next(apiError);
  }

  req.user = user.transform();
  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;
exports.ANONYMOUS = ANONYMOUS;

exports.authorize = (roles = User.roles) =>
  (req, res, next) => passport.authenticate(
      'jwt', {session: false},
      handleJWT(req, res, next, roles),
  )(req, res, next);
