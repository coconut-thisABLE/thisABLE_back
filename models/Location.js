const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

autoIncrement.initialize(mongoose.connection);

const locationSchema = new mongoose.Schema(
    {
      _id: {
        type: Number,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      locationType: {
        type: String,
        default: 'etc.',
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      position: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      isToiletExists: {
        type: Boolean,
        required: true,
        default: false,
      },
      isChargerExists: {
        type: Boolean,
        required: true,
        default: false,
      },
      isElevatorExists: {
        type: Boolean,
        required: true,
        default: false,
      },
      isSlopeExists: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    {
      timestamps: true,
    },
);

/**
 * @private
 */

const MAX_DISTANCE = 2000;
const LOCATION_TRANSFORMED = {
  $project: {
    _id: 1,
    name: 1,
    address: 1,
    locationType: 1,
    latitude: 1,
    longitude: 1,
    isToiletExists: 1,
    isChargerExists: 1,
    isSlopeExists: 1,
    isElevatorExists: 1,
    distance: {
      $substr: ['$distance', 0, 3],
    },
  },
};

locationSchema.statics = {
  async get(id) {
    const loc = await this.findById(id).exec();
    if (loc) {
      return loc;
    }
    throw new APIError({
      message: 'Location does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
  list({page, perPage, latitude, longitude}) {
    return this.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          distanceMultiplier: 0.001,
          maxDistance: MAX_DISTANCE,
          spherical: true,
        },
      },
      LOCATION_TRANSFORMED,
      {$sort: {'distance': 1}},
      {$skip: perPage * (page-1)},
      {$limit: perPage},
    ]);
  },
  allList({latitude, longitude}) {
    return this.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          distanceMultiplier: 0.001,
          maxDistance: MAX_DISTANCE,
          spherical: true,
        },
      },
      LOCATION_TRANSFORMED,
      {$sort: {'distance': 1}},
    ]);
  },
  searchList({type, sort, latitude, longitude}) {
    const condition = {
      'review': {'review': -1},
      'distance': {'distance': 1},
    };
    const sortCondition = condition[sort];
    return this.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          distanceMultiplier: 0.001,
          spherical: true,
        },
      },
      {$match: {locationType: type}},
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'locationId',
          pipeline: [{
            $group: {
              _id: null,
              star_average: {$avg: '$star'},
            },
          }],
          as: 'review',
        },
      },
      LOCATION_TRANSFORMED,
      {$sort: sortCondition},
      {$limit: 3},
    ]);
  },
  getSize({latitude, longitude}) {
    return this.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          distanceMultiplier: 0.001,
          maxDistance: 2000,
          spherical: true,
        },
      },
      {
        $count: 'count',
      },
    ]);
  },
  facilitiesListWithinRoute({latitude, longitude, maxDistance=2000}) {
    return this.find(
        {
          position: {
            $nearSphere: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $maxDistance: maxDistance,
            },
          },
          isElevatorExists: true,
          isSlopeExists: true,
        },
    );
  },
  getDistanceWithCurrentLocation({locationId, latitude, longitude}) {
    return this.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          distanceMultiplier: 0.001,
          spherical: true,
        },
      },
      {$match: {_id: parseInt(locationId)}},
      {
        $project: {
          latitude: 1,
          longitude: 1,
          distance: 1,
        },
      },
    ]);
  },
};

locationSchema.plugin(autoIncrement.plugin, {
  model: 'Location',
  field: '_id',
  startAt: 1,
  increment: 1,
});

module.exports = mongoose.model('Location', locationSchema);
