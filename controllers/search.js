const httpStatus = require('http-status');
const {Location} = require('../models');
const {paginate} = require('../util/pagination');

const DEFAULT_PAGE_SIZE = 10;


exports.toiletList = async (req, res, next) => {
  try {
    req.query.perPage = DEFAULT_PAGE_SIZE;

    const toilets = await Location.find({isToiletExists: true}).exec();
    const count = await Location.count({isToiletExists: true}).exec();

    const result = paginate({
      sizeOfModel: count,
      sizePerPage: DEFAULT_PAGE_SIZE,
      currentPageNumber: req.query.page,
      results: toilets,
    });
    return res.status(httpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.chargerList = async (req, res, next) => {
  try {
    req.query.perPage = DEFAULT_PAGE_SIZE;

    const chargers = await Location.find({isChargerExists: true}).exec();
    const count = await Location.count({isChargerExists: true}).exec();

    const result = paginate({
      sizeOfModel: count,
      sizePerPage: DEFAULT_PAGE_SIZE,
      currentPageNumber: req.query.page,
      results: chargers,
    });
    return res.status(httpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.elevatorList = async (req, res, next) => {
  try {
    req.query.perPage = DEFAULT_PAGE_SIZE;

    const elevators = await Location.find({isElevatorExists: true}).exec();
    const count = await Location.count({isElevatorExists: true}).exec();

    const result = paginate({
      sizeOfModel: count,
      sizePerPage: DEFAULT_PAGE_SIZE,
      currentPageNumber: req.query.page,
      results: elevators,
    });
    return res.status(httpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.slopeList = async (req, res, next) => {
  try {
    req.query.perPage = DEFAULT_PAGE_SIZE;

    const slopes = await Location.find({isSlopeExists: true}).exec();
    const count = await Location.count({isSlopeExists: true}).exec();

    const result = paginate({
      sizeOfModel: count,
      sizePerPage: DEFAULT_PAGE_SIZE,
      currentPageNumber: req.query.page,
      results: slopes,
    });
    return res.status(httpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
};


