const express = require('express');
const { getDashboardStats, getFleetAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/fleet', protect, authorize('Manager', 'Financial Analyst'), getFleetAnalytics);

module.exports = router;
