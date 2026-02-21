const MaintenanceLog = require('../models/MaintenanceLog');
const Vehicle = require('../models/Vehicle');

exports.getMaintenanceLogs = async (req, res) => {
    try {
        const logs = await MaintenanceLog.find({}).populate('vehicleId', 'name licensePlate').sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMaintenanceLog = async (req, res) => {
    try {
        const { vehicleId, serviceType, cost, date } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        if (vehicle.status === 'OnTrip') {
            return res.status(400).json({ message: 'Cannot service a vehicle currently on a trip' });
        }

        const log = await MaintenanceLog.create({
            vehicleId,
            serviceType,
            cost,
            date,
            status: 'InProgress'
        });

        vehicle.status = 'InShop';
        await vehicle.save();

        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.completeMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await MaintenanceLog.findById(id);

        if (!log) return res.status(404).json({ message: 'Maintenance log not found' });
        if (log.status === 'Completed') return res.status(400).json({ message: 'Maintenance is already completed' });

        log.status = 'Completed';
        await log.save();

        const vehicle = await Vehicle.findById(log.vehicleId);
        if (vehicle && vehicle.status === 'InShop') {
            vehicle.status = 'Available';
            await vehicle.save();
        }

        res.json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
