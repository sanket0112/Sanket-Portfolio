const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Temporary: Since there is no register route, we check if an admin exists, 
// if not, we create one using the .env credentials upon the first login attempt.
const seedAdmin = async () => {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        await Admin.create({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD // Note: In production, hash this with bcrypt
        });
        console.log('Default Admin seeded from .env');
    }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res, next) => {
    try {
        await seedAdmin(); // Ensure default admin exists
        
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        // Simple string comparison since we seeded directly. Real-world uses bcrypt.compare
        if (admin && admin.password === password) {
            res.json({
                _id: admin._id,
                email: admin.email,
                token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle block status of a user
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin)
const toggleBlockUser = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.params.id);
        
        if (user) {
            user.isBlocked = !user.isBlocked;
            await user.save();
            res.json({ message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}` });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { loginAdmin, getUsers, toggleBlockUser };
