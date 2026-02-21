const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    serviceType: { type: String, required: true },
    cost: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['InProgress', 'Completed'], default: 'InProgress' }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
