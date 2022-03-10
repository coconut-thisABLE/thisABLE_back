const httpStatus = require('http-status');
const {Location} = require('../models');
const {paginate} = require('../util/pagination');


exports.list = async (req, res, next) => {
  try {
    const DEFAULT_PAGE_SIZE = 10;
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
