const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const { check } = require('express-validator');

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { message: 'Too many contact requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Validation rules
const validateMessage = [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('subject', 'Subject is required').not().isEmpty().trim().escape(),
    check('message', 'Message is required').not().isEmpty().trim().escape()
];

router.route('/')
    .post(contactLimiter, validateMessage, sendMessage)
    .get(protect, getMessages);

router.route('/:id').delete(protect, deleteMessage);

module.exports = router;
