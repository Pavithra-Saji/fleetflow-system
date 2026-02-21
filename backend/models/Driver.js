const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    licenseExpiry: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Available', 'OnDuty', 'Suspended'],
        default: 'Available'
    },
    safetyScore: { type: Number, default: 100, min: 0, max: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
