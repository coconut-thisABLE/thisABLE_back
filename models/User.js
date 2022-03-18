const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const APIError = require('../errors/api-error');
const {env, jwtSecret, jwtExpirationInterval} = require('../config/vars');


/**
 * User Roles
 */
const roles = ['user', 'admin'];

/**
 * User Schema
 */
const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        unique: true,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
        enum: roles,
        default: 'user',
      },
      type: {
        type: String,
        required: true,
        enum: ['abled', 'disabled'],
        default: 'disabled',
      },
    },
    {
      timestamps: true,
    },
);

userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const rounds = env === 'test' ? 1 : 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  } catch (e) {
    return next(e);
  }
});

/**
 * statics
 */
userSchema.statics = {
  // roles,

  async findByEmail(email) {
    const user = this.findOne({email: email}).exec();
    if (user) return user;
    throw new APIError({
      message: 'User does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  async findAndGenerateToken(options) {
    const {email, password, refreshObject} = options;
    if (!email) {
      throw new APIError({message: 'An email is required to generate a token'});
    }

    const user = await this.findOne({email}).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && await user.comparePassword(password)) {
        const token = await user.token();
        return {user, accessToken: token};
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        const token = await user.token();
        return {user, accessToken: token};
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   * @param {Error} error
   * @return {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};

/**
 * Method
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'email', 'type', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
  async token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(payload, jwtSecret);
  },
  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  },
});

module.exports = mongoose.model('User', userSchema);
