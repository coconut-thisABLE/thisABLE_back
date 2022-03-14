const mongoose = require('mongoose');

const toiletSchema = new mongoose.Schema(
    {
      locationId: {
        type: Number,
        ref: 'Location',
        unique: true,
        required: true,
      },
    },
);

toiletSchema.statics = {
  async get(id) {
    const toilet = await this.find({locationId: id}).exec();
    if (toilet) {
      return toilet;
    }
    throw new APIError({
      message: 'Location Toilet does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
};

module.exports = mongoose.model('Toilet', toiletSchema);
