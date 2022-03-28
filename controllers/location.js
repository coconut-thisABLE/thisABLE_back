const httpStatus = require('http-status');
const {Location, Toilet, Charger} = require('../models');
const {paginate} = require('../util/pagination');
const midpoint = require('@turf/midpoint');

const DEFAULT_PAGE_SIZE = 10;

exports.list = async (req, res, next) => {
  try {
    req.query.perPage = DEFAULT_PAGE_SIZE;
    let result;
    if (req.query.page === 'all') {
      result = {};
      result.results = await Location.allList(req.query);
    } else {
      const locations = await Location.list(req.query);
      const sizeOfAllLocations = await Location.getSize(req.query);
      result = paginate({
        sizeOfModel: parseInt(sizeOfAllLocations[0].count),
        sizePerPage: DEFAULT_PAGE_SIZE,
        currentPageNumber: req.query.page,
        results: locations,
      });
    }

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

exports.getFacilitiesWithin = async (req, res, next) => {
  try {
    const dist = await Location.getDistanceWithCurrentLocation(req.query);

    const locationCoordinate = [dist[0].longitude, dist[0].latitude];
    const currentCoordinate = [req.query.longitude, req.query.latitude];
    const midPosition = midpoint(locationCoordinate, currentCoordinate);
    console.log('midPosition :', midPosition);

    const facilitesList = await Location.facilitiesListWithinRoute({
      longitude: midPosition.geometry.coordinates[0],
      latitude: midPosition.geometry.coordinates[1],
      maxDistance: dist[0].distance*1000/2,
    });
    return res.status(httpStatus.OK).json(facilitesList);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
