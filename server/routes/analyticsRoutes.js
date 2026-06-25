const express = require('express');
const router = express.Router();
const { trackVisit, getStats } = require('../controllers/analyticsController');
const { adminProtect } = require('../middleware/authMiddleware');

router.post('/track', trackVisit);
router.get('/', adminProtect, getStats);

module.exports = router;
