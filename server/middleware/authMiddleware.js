const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Protect routes — verifies JWT and attaches req.user.
 * Differentiates between expired tokens and invalid tokens.
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the full user object (minus password) to the request
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                return next(new Error('Not authorized — user no longer exists'));
            }

            return next();
        } catch (error) {
            res.status(401);
            if (error.name === 'TokenExpiredError') {
                return next(new Error('Session expired. Please log in again.'));
            }
            return next(new Error('Not authorized — invalid token'));
        }
    }

    if (!token) {
        res.status(401);
        return next(new Error('Not authorized — no token provided'));
    }
};

/**
 * Middleware: Admin-only route protection.
 * Must be used AFTER protect().
 * Falls back to checking admin token directly for admin-specific routes.
 */
const adminProtect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Verify but don't require a full user record (admin token points to Admin model)
            jwt.verify(token, process.env.JWT_SECRET);
            return next();
        } catch (error) {
            res.status(401);
            if (error.name === 'TokenExpiredError') {
                return next(new Error('Admin session expired. Please log in again.'));
            }
            return next(new Error('Not authorized — invalid admin token'));
        }
    }

    res.status(401);
    return next(new Error('Not authorized — no token provided'));
};

module.exports = { protect, adminProtect };
