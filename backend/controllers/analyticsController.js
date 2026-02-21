const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const MaintenanceLog = require('../models/MaintenanceLog');
const FuelLog = require('../models/FuelLog');

exports.getDashboardStats = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        const drivers = await Driver.find({});

        const activeFleet = vehicles.filter(v => v.status === 'OnTrip').length;
        const inShop = vehicles.filter(v => v.status === 'InShop').length;
        const available = vehicles.filter(v => v.status === 'Available').length;
        const totalFleet = vehicles.length;
        const utilizationRate = totalFleet ? (activeFleet / totalFleet) * 100 : 0;

        const suspendedDriversList = drivers.filter(d => d.status === 'Suspended').map(d => d.name);
        const expiringLicensesList = drivers.filter(d => {
            const diff = new Date(d.licenseExpiry) - new Date();
            return diff > 0 && diff < (30 * 24 * 60 * 60 * 1000); // Expiring in next 30 days
        }).map(d => ({ name: d.name, expiry: d.licenseExpiry }));

        const pendingTrips = await Trip.countDocuments({ status: 'Draft' });

        const mLogs = await MaintenanceLog.find({});
        const fLogs = await FuelLog.find({});
        const tMaintCost = mLogs.reduce((acc, log) => acc + log.cost, 0);
        const tFuelCost = fLogs.reduce((acc, log) => acc + log.cost, 0);
        const totalOperationalCost = tMaintCost + tFuelCost;

        res.json({
            activeFleet,
            inShop,
            available,
            totalFleet,
            utilizationRate: utilizationRate.toFixed(2),
            pendingTrips,
            totalOperationalCost,
            suspendedDrivers: suspendedDriversList.length,
            suspendedDriversList,
            expiredLicenses: drivers.filter(d => new Date(d.licenseExpiry) < new Date()).length,
            expiringLicensesList
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFleetAnalytics = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        const mLogs = await MaintenanceLog.find({});
        const fLogs = await FuelLog.find({});
        const trips = await Trip.find({ status: 'Completed' });

        const analytics = vehicles.map(vehicle => {
            const vFuel = fLogs.filter(f => f.vehicleId.toString() === vehicle._id.toString());
            const vMaint = mLogs.filter(m => m.vehicleId.toString() === vehicle._id.toString());
            const vTrips = trips.filter(t => t.vehicleId.toString() === vehicle._id.toString());

            const litersUsed = vFuel.reduce((acc, log) => acc + log.liters, 0);
            const fuelCost = vFuel.reduce((acc, log) => acc + log.cost, 0);
            const maintCost = vMaint.reduce((acc, log) => acc + log.cost, 0);
            const totalCost = fuelCost + maintCost;

            let kmDriven = 0;
            vTrips.forEach(trip => {
                kmDriven += (trip.endOdometer - trip.startOdometer);
            });

            // If no completed trips, use current odometer as fallback if needed, but normally use trips.
            // Let's use vehicle.odometer for simplicity for kmDriven if we assume it started at 0
            kmDriven = vehicle.odometer;

            const fuelEfficiency = litersUsed > 0 ? (kmDriven / litersUsed).toFixed(2) : 0;
            const costPerKm = kmDriven > 0 ? (totalCost / kmDriven).toFixed(2) : 0;

            const revenue = kmDriven * vehicle.revenuePerKm;
            const roi = vehicle.acquisitionCost > 0 ? (((revenue - totalCost) / vehicle.acquisitionCost) * 100).toFixed(2) : 0;

            return {
                vehicle: vehicle.name,
                licensePlate: vehicle.licensePlate,
                kmDriven,
                litersUsed,
                fuelCost,
                maintCost,
                totalCost,
                fuelEfficiency,
                costPerKm,
                revenue,
                roi
            };
        });

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
