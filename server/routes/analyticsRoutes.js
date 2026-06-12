const express = require('express');
const router = express.Router();
const { trackVisit, getStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.post('/track', trackVisit);
router.get('/', protect, getStats);

module.exports = router;
