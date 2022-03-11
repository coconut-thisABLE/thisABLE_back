const {base} = require('../config/vars');


exports.paginate = ({sizeOfModel, sizePerPage, currentPageNumber, results}) => {
  const total = parseInt(sizeOfModel/sizePerPage) + 1;
  const nextPageUrl =
    (currentPageNumber == total) ?
    null :
    `${base}?page=${parseInt(currentPageNumber)+1}`;

  return {
    totalPage: total,
    currentPage: currentPageNumber,
    nextUrl: nextPageUrl,
    results: results,
  };
};
