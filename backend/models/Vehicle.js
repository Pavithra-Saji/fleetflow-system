const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true },
    maxCapacity: { type: Number, required: true }, // in kg
    odometer: { type: Number, required: true, default: 0 },
    acquisitionCost: { type: Number, default: 50000 },
    revenuePerKm: { type: Number, default: 5 },
    status: {
        type: String,
        enum: ['Available', 'OnTrip', 'InShop', 'Retired'],
        default: 'Available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
