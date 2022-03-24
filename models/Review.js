const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omit} = require('lodash');
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

/**
 * statics
 */
reviewSchema.statics = {
  async register(review) {
    if (review.user) {
      review.userId = review.user._id;
      review.userType = review.user.type;
    }
    review = omit(review, 'user');
    return this.create(review);
  },
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
  // async getStarRateAverage(locationId) {
  //   return this.find({locationId: locationId}).
  // }
};

module.exports = mongoose.model('Review', reviewSchema);
