const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');

exports.getFuelLogs = async (req, res) => {
    try {
        const logs = await FuelLog.find({}).populate('vehicleId', 'name licensePlate').sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createFuelLog = async (req, res) => {
    try {
        const { vehicleId, liters, cost, date } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        const log = await FuelLog.create({
            vehicleId,
            liters,
            cost,
            date
        });

        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
