const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

const reviewSchema = new mongoose.Schema(
    {
      locationId: {
        type: Number,
        ref: 'Location',
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
      userType: {
        type: String,
        required: true,
        default: 'anonymous',
      },
      detail: {
        type: String,
        required: true,
      },
      star: {
        type: Number,
        required: true,
        min: 0.0,
        max: 5.0,
      },
      good: {
        type: Number,
        default: 0,
        min: 0,
      },
      bad: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
    },
);

reviewSchema.pre('save', async function save(next) {
  try {
    if (user == null) return next();
    this.userType = user.type;
    return next();
  } catch (e) {
    return next(e);
  }
});

/**
 * statics
 */
reviewSchema.statics = {
  async get(id) {
    let review;
    if (mongoose.Types.ObjectId.isValid(id)) {
      review = await this.findById(id).exec();
    }
    if (review) {
      return review;
    }

    throw new APIError({
      message: 'Not found',
      status: httpStatus.NOT_FOUND,
      isPublic: true,
    });
  },
  async findListByLocationId(locationId) {
    return this.find({locationId: locationId}).exec();
  },
  async findListByUserId(userId) {
    return this.find({userId: userId}).exec();
  },
};

module.exports = mongoose.model('Review', reviewSchema);
