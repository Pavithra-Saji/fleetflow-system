const Driver = require('../models/Driver');

exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({}).sort({ createdAt: -1 });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createDriver = async (req, res) => {
    try {
        const { name, licenseNumber, licenseExpiry, status, safetyScore } = req.body;
        const exists = await Driver.findOne({ licenseNumber });
        if (exists) return res.status(400).json({ message: 'License number must be unique' });

        const driver = await Driver.create({ name, licenseNumber, licenseExpiry, status, safetyScore });
        res.status(201).json(driver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, licenseNumber, licenseExpiry, status, safetyScore } = req.body;

        if (licenseNumber) {
            const exists = await Driver.findOne({ licenseNumber, _id: { $ne: id } });
            if (exists) return res.status(400).json({ message: 'License number must be unique' });
        }

        const driver = await Driver.findByIdAndUpdate(id, { name, licenseNumber, licenseExpiry, status, safetyScore }, { new: true, runValidators: true });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });
        res.json(driver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Driver.findById(id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        if (driver.status === 'OnDuty') {
            return res.status(400).json({ message: 'Cannot delete a driver who is currently on a trip' });
        }

        await Driver.findByIdAndDelete(id);
        res.json({ message: 'Driver removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
