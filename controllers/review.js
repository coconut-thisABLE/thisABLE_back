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
