const httpStatus = require('http-status');
const {Location, Toilet, Charger} = require('../models');
const {paginate} = require('../util/pagination');

const DEFAULT_PAGE_SIZE = 10;

exports.list = async (req, res, next) => {
  try {
    req.query.perPage = DEFAULT_PAGE_SIZE;
    const locations = await Location.list(req.query);

    const sizeOfAllLocations = Object.keys(locations).length;
    const result = paginate({
      sizeOfModel: sizeOfAllLocations,
      sizePerPage: DEFAULT_PAGE_SIZE,
      currentPageNumber: req.query.page,
      results: locations,
    });
    return res.status(httpStatus.OK).json(result);
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

exports.search = async (req, res, next) => {
  try {
    const result = await Location.searchList(req.query);
    return res.status(httpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getToiletById = async (req, res, next) => {
  try {
    const toilet = await Toilet.get(req.params.locationId);
    return res.status(httpStatus.OK).json({
      'message': 'get toilet info success',
      'data': toilet,
    });
  } catch (error) {
    next(error);
  }
};

exports.getChargerById = async (req, res, next) => {
  try {
    const charger = await Charger.get(req.params.locationId);
    return res.status(httpStatus.OK).json({
      'message': 'get charger info success',
      'data': charger,
    });
  } catch (error) {
    next(error);
  }
};
