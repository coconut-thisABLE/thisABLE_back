const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const jwt = require('../modules/jwt');
const APIError = require('../errors/api-error');
const {env} = require('../config/vars');


autoIncrement.initialize(mongoose.connection);

/**
 * User Roles
 */
const roles = ['user', 'admin'];

/**
 * User Schema
 */
const userSchema = new mongoose.Schema(
    {
      _id: {
        type: Number,
        unique: true,
      },
      email: {
        type: String,
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
      if (user && await user.passwordMatches(password)) {
        return {user, accessToken: user.token()};
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return {user, accessToken: user.token()};
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
    if (error.name === 'MongoError' && error.code === 11000) {
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

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: '_id',
  startAt: 1,
  increment: 1,
});

/**
 * Method
 */
userSchema.method({

  async token() {
    const {token} = await jwt.sign(this);
    return token;
  },
  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  },
});

module.exports = mongoose.model('User', userSchema);
