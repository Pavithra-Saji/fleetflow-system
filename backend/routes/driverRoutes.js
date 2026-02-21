const express = require('express');
const { getDrivers, getDriverById, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, getDrivers)
    .post(protect, authorize('Manager', 'Safety Officer'), createDriver);

router.route('/:id')
    .get(protect, getDriverById)
    .put(protect, authorize('Manager', 'Safety Officer'), updateDriver)
    .delete(protect, authorize('Manager'), deleteDriver);

module.exports = router;
