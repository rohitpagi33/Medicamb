const express = require('express');
const router = express.Router();
const { adminLogin, protectAdmin } = require('../middleware/adminMiddleware');
const {
  getAllHospitals, createHospital, updateHospital, deleteHospital, updateSlots,
  getAllUsers, getUserById, updateUser, deleteUser, getStats,
} = require('../controllers/adminController');

// Admin login (public)
router.post('/login', adminLogin);

// Stats
router.get('/stats', protectAdmin, getStats);

// Hospital management
router.get('/hospitals', protectAdmin, getAllHospitals);
router.post('/hospitals', protectAdmin, createHospital);
router.put('/hospitals/:id', protectAdmin, updateHospital);
router.delete('/hospitals/:id', protectAdmin, deleteHospital);
router.patch('/hospitals/:id/slots', protectAdmin, updateSlots);

// User management
router.get('/users', protectAdmin, getAllUsers);
router.get('/users/:id', protectAdmin, getUserById);
router.put('/users/:id', protectAdmin, updateUser);
router.delete('/users/:id', protectAdmin, deleteUser);

module.exports = router;
