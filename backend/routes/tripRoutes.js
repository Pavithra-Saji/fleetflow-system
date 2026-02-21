const express = require('express');
const { getTrips, getTripById, createTrip, updateTripStatus } = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, getTrips)
    .post(protect, authorize('Manager', 'Dispatcher'), createTrip);

router.route('/:id')
    .get(protect, getTripById)
    .put(protect, authorize('Manager', 'Dispatcher'), updateTripStatus);

module.exports = router;
