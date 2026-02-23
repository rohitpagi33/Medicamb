const express = require('express');
const router = express.Router();
const { askAI, getHistory } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, askAI);
router.get('/history', protect, getHistory);

module.exports = router; 