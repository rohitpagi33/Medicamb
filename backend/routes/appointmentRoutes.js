const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  getAppointmentPdf,
} = require('../controllers/appointmentController');

// User must be logged in for appointments
router.post('/', protect, createAppointment);
router.get('/me', protect, getMyAppointments);
router.get('/:id', protect, getAppointmentById);
router.get('/:id/pdf', protect, getAppointmentPdf);

module.exports = router;


