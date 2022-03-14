const mongoose = require('mongoose');

const chargerSchema = new mongoose.Schema(
    {
      locationId: {
        type: Number,
        ref: 'Location',
        unique: true,
        required: true,
      },
    },
);

chargerSchema.statics = {
  async get(id) {
    const charger = await this.find({locationId: id}).exec();
    if (charger) {
      return charger;
    }
    throw new APIError({
      message: 'Location Toilet does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
};

module.exports = mongoose.model('Charger', chargerSchema);
