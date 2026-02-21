const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({}).populate('vehicleId', 'name licensePlate status').populate('driverId', 'name licenseNumber status');
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('vehicleId').populate('driverId');
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTrip = async (req, res) => {
    try {
        const { vehicleId, driverId, cargoWeight, startOdometer } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        const driver = await Driver.findById(driverId);

        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        if (vehicle.status !== 'Available') return res.status(400).json({ message: 'Vehicle must be Available' });
        if (driver.status !== 'Available') return res.status(400).json({ message: 'Driver must be Available' });
        if (cargoWeight > vehicle.maxCapacity) return res.status(400).json({ message: `Cargo weight exceeds vehicle capacity (${vehicle.maxCapacity})` });

        if (new Date(driver.licenseExpiry) < new Date()) return res.status(400).json({ message: 'Driver license is expired' });

        const trip = await Trip.create({
            vehicleId,
            driverId,
            cargoWeight,
            status: 'Dispatched',
            startOdometer: startOdometer || vehicle.odometer
        });

        vehicle.status = 'OnTrip';
        await vehicle.save();

        driver.status = 'OnDuty';
        await driver.save();

        res.status(201).json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateTripStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, endOdometer } = req.body;

        const trip = await Trip.findById(id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        if (trip.status === 'Completed' || trip.status === 'Cancelled') {
            return res.status(400).json({ message: `Trip is already ${trip.status}` });
        }

        trip.status = status;
        if (status === 'Completed') {
            if (!endOdometer) return res.status(400).json({ message: 'End odometer is required when completing a trip' });
            if (endOdometer < trip.startOdometer) return res.status(400).json({ message: 'End odometer cannot be less than start odometer' });
            trip.endOdometer = endOdometer;

            const vehicle = await Vehicle.findById(trip.vehicleId);
            if (vehicle) {
                vehicle.status = 'Available';
                vehicle.odometer = endOdometer;
                await vehicle.save();
            }

            const driver = await Driver.findById(trip.driverId);
            if (driver) {
                driver.status = 'Available';
                await driver.save();
            }
        } else if (status === 'Cancelled') {
            const vehicle = await Vehicle.findById(trip.vehicleId);
            if (vehicle) {
                vehicle.status = 'Available';
                await vehicle.save();
            }

            const driver = await Driver.findById(trip.driverId);
            if (driver) {
                driver.status = 'Available';
                await driver.save();
            }
        }

        await trip.save();
        res.json(trip);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
