const mongoose = require('mongoose');

const chargerSchema = new mongoose.Schema(
    {
        locationId: {
            type: Number,
            required: true
        }
    }
);

module.exports = mongoose.model('Charger', chargerSchema);
