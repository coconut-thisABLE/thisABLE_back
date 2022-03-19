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

/**
 * @private
 * @param {string} query
 * @return {object} condtion
 */
function getQueryFilterCondition(query) {
  const FILTER_CONDITION_DICTIONARY = {
    toilet: {isToiletExists: true},
    charger: {isChargerExists: true},
    elevator: {isElevatorExists: true},
    slope: {isSlopeExists: true},
  };
  return FILTER_CONDITION_DICTIONARY[query];
}

/**
 * @private
 * @param {string} query
 * @return {Array} filteredLocations
 */
async function search({query, page, latitude, longitude}) {
  const filteredCondition = getQueryFilterCondition(query);
  const data = await Location.searchList(
      filteredCondition,
      {
        page: page,
        perPage: DEFAULT_PAGE_SIZE,
      },
      {
        latitude,
        longitude,
      },
  );
  const count = await Location.count(filteredCondition).exec();
  return {data, count};
}

exports.search = async (req, res, next) => {
  try {
    const searchResultData = await search(req.query);
    const result = paginate({
      sizeOfModel: searchResultData.count,
      sizePerPage: DEFAULT_PAGE_SIZE,
      currentPageNumber: req.query.page,
      results: searchResultData.data,
    });
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
