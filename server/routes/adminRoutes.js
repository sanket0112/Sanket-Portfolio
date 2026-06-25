const express = require('express');
const router = express.Router();
const { loginAdmin, getUsers, toggleBlockUser, deleteUser } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/users', adminProtect, getUsers);
router.route('/users/:id')
    .put(adminProtect, toggleBlockUser)
    .delete(adminProtect, deleteUser);

module.exports = router;
