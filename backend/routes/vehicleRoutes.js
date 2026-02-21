const express = require('express');
const { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, getVehicles)
    .post(protect, authorize('Manager'), createVehicle);

router.route('/:id')
    .get(protect, getVehicleById)
    .put(protect, authorize('Manager', 'Safety Officer'), updateVehicle)
    .delete(protect, authorize('Manager'), deleteVehicle);

module.exports = router;
