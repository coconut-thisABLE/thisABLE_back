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
    return this.aggregate([
      {$match: {locationId: parseInt(locationId)}},
      {$project: {
        _id: 1,
        locationId: 1,
        userId: 1,
        userType: 1,
        detail: 1,
        star: 1,
        good: 1,
        bad: 1,
        createdAt: {
          $dateToString: {
            date: '$createdAt',
            format: '%Y-%m-%d',
            timezone: 'Asia/Seoul',
          },
        },
      }},
      {$sort: {createdAt: -1}},
    ])
        .exec();
  },
  async findListByUserId(userId) {
    return this.find({userId: userId}).exec();
  },
  async getCountByLocationId(locationId) {
    return this.find({locationId: locationId}).count();
  },
  async getAverageByLocationId(locationId) {
    const starRateAverage = await this.aggregate()
        .match({locationId: parseInt(locationId)})
        .group({_id: '$locationId', avg_val: {$avg: '$star'}});
    return starRateAverage[0].avg_val;
  },
};

module.exports = mongoose.model('Review', reviewSchema);
