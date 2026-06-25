const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [8, 'Password must be at least 8 characters']
        },

        // ── Admin Controls ──────────────────────────────────────────────────
        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

/**
 * Compare a plain-text password against the stored hash.
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
