const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createVehicle = async (req, res) => {
    try {
        const { name, licensePlate, maxCapacity, odometer, status } = req.body;
        const exists = await Vehicle.findOne({ licensePlate });
        if (exists) return res.status(400).json({ message: 'License plate must be unique' });

        const vehicle = await Vehicle.create({ name, licensePlate, maxCapacity, odometer, status });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, licensePlate, maxCapacity, odometer, status } = req.body;

        if (licensePlate) {
            const exists = await Vehicle.findOne({ licensePlate, _id: { $ne: id } });
            if (exists) return res.status(400).json({ message: 'License plate must be unique' });
        }

        const vehicle = await Vehicle.findByIdAndUpdate(id, { name, licensePlate, maxCapacity, odometer, status }, { new: true, runValidators: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        if (vehicle.status === 'OnTrip') {
            return res.status(400).json({ message: 'Cannot delete a vehicle that is currently on a trip' });
        }

        await Vehicle.findByIdAndDelete(id);
        res.json({ message: 'Vehicle removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
