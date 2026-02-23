const express = require('express');
const router = express.Router();
const { getHospitals, getHospitalById } = require('../controllers/hospitalController');

// Public hospital search
router.get('/', getHospitals);
router.get('/:id', getHospitalById);

module.exports = router;


