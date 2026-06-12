const express = require('express');
const router = express.Router();
const { loginAdmin, getUsers, toggleBlockUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/users', protect, getUsers);
router.put('/users/:id/block', protect, toggleBlockUser);

module.exports = router;
