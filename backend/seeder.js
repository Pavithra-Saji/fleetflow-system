const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Vehicle.deleteMany();
        await Driver.deleteMany();

        const users = [
            { name: 'Admin Manager', email: 'manager@fleetflow.com', password: 'password123', role: 'Manager' },
            { name: 'Dispatcher Dan', email: 'dispatcher@fleetflow.com', password: 'password123', role: 'Dispatcher' },
            { name: 'Safety Sam', email: 'safety@fleetflow.com', password: 'password123', role: 'Safety Officer' },
            { name: 'Finance Faye', email: 'finance@fleetflow.com', password: 'password123', role: 'Financial Analyst' }
        ];

        await User.insertMany(users);

        const vehicles = [
            { name: 'Volvo FH16', licensePlate: 'TRK-001', maxCapacity: 20000, odometer: 15000 },
            { name: 'Scania R500', licensePlate: 'TRK-002', maxCapacity: 25000, odometer: 22000 },
            { name: 'Mercedes Actros', licensePlate: 'TRK-003', maxCapacity: 18000, odometer: 10000 },
            { name: 'MAN TGX', licensePlate: 'TRK-004', maxCapacity: 22000, odometer: 5000 }
        ];

        await Vehicle.insertMany(vehicles);

        const drivers = [
            { name: 'John Doe', licenseNumber: 'DL-A101', licenseExpiry: new Date('2028-05-20'), safetyScore: 95 },
            { name: 'Jane Smith', licenseNumber: 'DL-B202', licenseExpiry: new Date('2027-11-15'), safetyScore: 88 },
            { name: 'Bob Johnson', licenseNumber: 'DL-C303', licenseExpiry: new Date('2025-01-10'), safetyScore: 92 }, // Warning: Might expire depending on date!
            { name: 'Mike Tyson', licenseNumber: 'DL-D404', licenseExpiry: new Date('2029-08-08'), safetyScore: 100 }
        ];

        await Driver.insertMany(drivers);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
