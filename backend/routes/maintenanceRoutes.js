const express = require('express');
const { getMaintenanceLogs, createMaintenanceLog, completeMaintenance } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, getMaintenanceLogs)
    .post(protect, authorize('Manager', 'Safety Officer'), createMaintenanceLog);

router.route('/:id/complete')
    .put(protect, authorize('Manager', 'Safety Officer'), completeMaintenance);

module.exports = router;
