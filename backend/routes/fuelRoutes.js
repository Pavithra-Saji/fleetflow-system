const express = require('express');
const { getFuelLogs, createFuelLog } = require('../controllers/fuelController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, getFuelLogs)
    .post(protect, authorize('Manager', 'Dispatcher'), createFuelLog);

module.exports = router;
