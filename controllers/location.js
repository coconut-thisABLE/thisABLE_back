const httpStatus = require('http-status');
const {Location} = require('../models');
const {paginate} = require('../util/pagination');

const DEFAULT_PAGE_SIZE = 10;

exports.list = async (req, res, next) => {
  try {
    req.query.perPage = DEFAULT_PAGE_SIZE;
    const locations = await Location.list(req.query);

    const sizeOfAllLocations = await Location.getSize();
    const result = paginate({
      sizeOfModel: sizeOfAllLocations,
      sizePerPage: DEFAULT_PAGE_SIZE,
      currentPageNumber: req.query.page,
      results: locations,
    });
    res.status(httpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const location = await Location.get(req.params.locationId);
    return res.status(httpStatus.OK).json({
      'message': 'Retrieve Location By Id Success',
      'response': location,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const loc = new Location(req.body);
    await loc.save();
    res.status(httpStatus.CREATED).json({
      'message': 'success',
    });
  } catch (e) {
    next(e);
  }
};
