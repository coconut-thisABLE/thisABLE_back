const httpStatus = require('http-status');
const {Review} = require('../models');

exports.listByLocation = async (req, res, next) => {
  try {
    const locationId = req.params.locationId;
    const reviews = await Review.findListByLocationId(locationId);
    return res.status(httpStatus.OK).json({
      'message': `List Review of location number ${locationId} Success`,
      'response': reviews,
    });
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    req.body.user = req.user;
    await Review.register(req.body);
    return res.status(httpStatus.CREATED).json({
      message: 'Create new review Success',
    });
  } catch (e) {
    next(e);
  }
};

exports.recommend = async (req, res, next) => {
  try {
    const review = await Review.get(req.body.reviewId);
    await review.updateOne({
      good: review.good+1,
    }).exec();
    return res.status(httpStatus.CREATED).json({'message': 'success'});
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.discourage = async (req, res, next) => {
  try {
    const review = await Review.get(req.body.reviewId);
    await review.updateOne({
      bad: review.bad+1,
    }).exec();
    return res.status(httpStatus.CREATED).json({'message': 'success'});
  } catch (e) {
    next(e);
  }
};
