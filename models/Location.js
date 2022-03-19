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
 * 
 */
const SORTING_BY_DISTACNE_CONDITION = (latitude, longitude) => {
  return {
    position: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: 2000,
      },
    },
  }
}

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
    return this.find(SORTING_BY_DISTACNE_CONDITION(latitude, longitude))
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
  },
  searchList(query, {page, perPage}, {latitude, longitude}) {
    return this.find({
      ...SORTING_BY_DISTACNE_CONDITION(latitude, longitude),
      ...query
    })
        .sort({_id: 1})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
  },
  getSize() {
    return this.count();
  },
};

locationSchema.plugin(autoIncrement.plugin, {
  model: 'Location',
  field: '_id',
  startAt: 1,
  increment: 1,
});

module.exports = mongoose.model('Location', locationSchema);
