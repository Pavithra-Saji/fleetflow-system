const express = require('express');
const { getUsers, updateUser, deleteUser, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, authorize('Manager'), getUsers)
    .post(protect, authorize('Manager'), createUser);

router.route('/:id')
    .put(protect, authorize('Manager'), updateUser)
    .delete(protect, authorize('Manager'), deleteUser);

module.exports = router;
