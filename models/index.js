const user = require('./User');
const location = require('./Location');
const toilet = require('./Toilet');
const charger = require('./Charger');
const review = require('./Review');
const refresh = require('./RefreshToken');

module.exports = {
  User: user,
  Location: location,
  Toilet: toilet,
  Charger: charger,
  Review: review,
  RefreshToken: refresh,
};
