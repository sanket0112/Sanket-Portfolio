const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// ── Seed Admin ─────────────────────────────────────────────────────────────────

/**
 * Seed the default admin from .env credentials on first startup.
 * Uses bcrypt hashing via the Admin model pre-save hook.
 */
const seedAdmin = async () => {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        await Admin.create({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD // Hashed by Admin model pre-save hook
        });
        console.log('Default Admin seeded with hashed password from .env');
    } else if (adminCount > 0) {
        // Fix any existing admin with an unhashed password (plain-text recovery)
        const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL?.toLowerCase() });
        if (admin && !admin.password.startsWith('$2')) {
            admin.password = process.env.ADMIN_PASSWORD;
            await admin.save(); // pre-save hook will hash it
            console.log('Fixed admin password — rehashed via pre-save hook');
        }
    }
};

// ── Login Admin ────────────────────────────────────────────────────────────────

/**
 * @desc    Authenticate admin and return JWT
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res, next) => {
    try {
        await seedAdmin();

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            return next(new Error('Email and password are required'));
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });

        // Use bcrypt.compare via matchPassword method (no plain-text comparison)
        if (admin && (await admin.matchPassword(password))) {
            return res.status(200).json({
                _id: admin._id,
                email: admin.email,
                token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
                })
            });
        } else {
            res.status(401);
            return next(new Error('Invalid email or password'));
        }
    } catch (error) {
        next(error);
    }
};

// ── Get All Users ──────────────────────────────────────────────────────────────

/**
 * @desc    Get all registered users (excluding sensitive fields)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getUsers = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const users = await User.find({}).select('-password -otpHash -resetOtpHash');
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// ── Toggle Block User ──────────────────────────────────────────────────────────

/**
 * @desc    Block or unblock a user by ID
 * @route   PUT /api/admin/users/:id/block
 * @access  Private (Admin)
 */
const toggleBlockUser = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            return next(new Error('User not found'));
        }

        user.isBlocked = !user.isBlocked;
        await user.save();
        return res.status(200).json({
            message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            isBlocked: user.isBlocked
        });
    } catch (error) {
        next(error);
    }
};

// ── Delete User ────────────────────────────────────────────────────────────────

/**
 * @desc    Delete a user by ID
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            return next(new Error('User not found'));
        }

        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: 'User removed successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { loginAdmin, getUsers, toggleBlockUser, deleteUser };
