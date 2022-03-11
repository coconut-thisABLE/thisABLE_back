const mongoose = require('mongoose');

const toiletSchema = new mongoose.Schema(
    {
      locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
      },
    },
);

module.exports = mongoose.model('Toilet', toiletSchema);
