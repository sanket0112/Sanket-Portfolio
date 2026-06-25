const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
    registerUser,
    loginUser,
    getMe
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// ── Rate Limiters ──────────────────────────────────────────────────────────────

/** Strict limiter for login: 10 attempts per 15 minutes */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

/** Registration limiter: 5 registrations per hour per IP */
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { message: 'Too many registration attempts. Please try again after an hour.' },
    standardHeaders: true,
    legacyHeaders: false
});



// ── Public Routes ──────────────────────────────────────────────────────────────
router.post('/register',           registerLimiter, registerUser);
router.post('/login',              loginLimiter,    loginUser);

// ── Protected Routes ───────────────────────────────────────────────────────────
router.get('/me', protect, getMe);

module.exports = router;
