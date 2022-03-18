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
    req.body.userId = req.user ? req.uesr._id : null;
    await new Review(req.body).save();
    return res.status(httpStatus.CREATED).json({
      message: 'Create new review Success',
    });
  } catch (e) {
    next(e);
  }
};
