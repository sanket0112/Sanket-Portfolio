const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Generate a signed JWT for a given user ID.
 * @param {string} id - MongoDB user _id
 * @returns {string} signed JWT
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

/**
 * Evaluate password strength.
 * Requires: 8+ chars, uppercase, lowercase, digit, special char.
 * @param {string} password
 * @returns {boolean}
 */
const isStrongPassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;
    return strongRegex.test(password);
};

// ── Register ───────────────────────────────────────────────────────────────────

/**
 * @desc    Register a new user and send email OTP
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // ── Field presence validation ──
        if (!name || !email || !password || !confirmPassword) {
            res.status(400);
            return next(new Error('All fields are required: name, email, password, confirmPassword'));
        }

        // ── Name validation ──
        if (name.trim().length < 2) {
            res.status(400);
            return next(new Error('Name must be at least 2 characters long'));
        }

        // ── Email format validation ──
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
        if (!emailRegex.test(email)) {
            res.status(400);
            return next(new Error('Please enter a valid email address'));
        }

        // ── Password match ──
        if (password !== confirmPassword) {
            res.status(400);
            return next(new Error('Passwords do not match'));
        }

        // ── Password strength ──
        if (!isStrongPassword(password)) {
            res.status(400);
            return next(new Error(
                'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (@$!%*?&^#)'
            ));
        }

        // ── Duplicate email check ──
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            res.status(409);
            return next(new Error('An account with this email already exists. Please log in.'));
        }

        // ── Hash password ──
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ── Create user ──
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword
        });

        return res.status(201).json({
            message: 'Registration successful! You can now log in.',
            email: user.email
        });
    } catch (error) {
        next(error);
    }
};

// ── Login ──────────────────────────────────────────────────────────────────────

/**
 * @desc    Authenticate user and return JWT
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            return next(new Error('Email and password are required'));
        }

        // ── Check if admin is attempting login via user route ──
        if (email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
            const Admin = require('../models/Admin');
            const admin = await Admin.findOne({ email: email.toLowerCase() });
            if (admin && (await admin.matchPassword(password))) {
                return res.json({
                    _id: admin._id,
                    name: 'Admin',
                    email: admin.email,
                    isAdmin: true,
                    token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
                    })
                });
            }
        }

        // ── Find user by email ──
        const user = await User.findOne({ email: email.toLowerCase() });

        // ── User does not exist ──
        if (!user) {
            res.status(404);
            return next(new Error('Account not found. Please create an account first.'));
        }

        // ── Account blocked ──
        if (user.isBlocked) {
            res.status(403);
            return next(new Error('Your account has been blocked by the Administrator. Please contact support.'));
        }

        // ── Password comparison (bcrypt) ──
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            res.status(401);
            return next(new Error('Invalid email or password.'));
        }

        // ── All checks passed — issue JWT ──
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: false,
            token: generateToken(user._id),
            message: 'Welcome back!'
        });
    } catch (error) {
        next(error);
    }
};

// ── Get Current User ───────────────────────────────────────────────────────────

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            res.status(404);
            return next(new Error('User not found'));
        }
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe
};
