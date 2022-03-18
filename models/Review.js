const mongoose = require('mongoose');
const APIError = require('../errors/api-error');

const reviewSchema = new mongoose.Schema(
    {
      _id: {
        type: Number,
        unique: true,
      },
      locationId: {
        type: Number,
        ref: 'Location',
        required: true,
      },
      userId: {
        type: Number,
        ref: 'User',
        required: false,
      },
      userType: {
        type: String,
        required: true,
        default: 'anonymous',
      },
      detail: {
        type: Text,
        required: true,
      },
      star_rate: {
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
    if (this.user == null) return next();
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
  async findListByLocationId(locationId) {
    return this.find({locationId: locationId}).exec();
  },
  async findListByUserId(userId) {
    return this.find({userId: userId}).exec();
  },
};

module.exports = mongoose.model('Review', reviewSchema);
