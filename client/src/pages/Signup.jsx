import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

// ── Password strength checker ──────────────────────────────────────────────────
const getPasswordStrength = (password) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&^#]/.test(password)
    };
    const passed = Object.values(checks).filter(Boolean).length;
    let label = '';
    let color = '';
    let width = `${(passed / 5) * 100}%`;
    if (passed <= 1) { label = 'Very Weak'; color = '#ef4444'; }
    else if (passed === 2) { label = 'Weak'; color = '#f97316'; }
    else if (passed === 3) { label = 'Fair'; color = '#eab308'; }
    else if (passed === 4) { label = 'Strong'; color = '#22c55e'; }
    else { label = 'Very Strong'; color = '#06b6d4'; }
    return { checks, label, color, width, score: passed };
};

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const strength = getPasswordStrength(formData.password);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('/api/users/register', formData);
            toast.success(res.data.message || 'Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const passwordChecks = [
        { key: 'length',    label: 'At least 8 characters' },
        { key: 'uppercase', label: 'One uppercase letter' },
        { key: 'lowercase', label: 'One lowercase letter' },
        { key: 'number',    label: 'One number' },
        { key: 'special',   label: 'One special character (@$!%*?&^#)' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="auth-page-wrapper"
        >
            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <div className="auth-icon-circle">
                        <span style={{ fontSize: '1.5rem' }}>✨</span>
                    </div>
                    <h2 className="auth-title text-gradient">Create Account</h2>
                    <p className="auth-subtitle">Join to explore Sanket's portfolio</p>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="auth-error-banner"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <FaTimes style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSignup} noValidate>
                    {/* Name */}
                    <div className="auth-field">
                        <label className="auth-label">Full Name</label>
                        <input
                            id="signup-name"
                            type="text"
                            name="name"
                            className="auth-input"
                            placeholder="Patel Sanket"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                        />
                    </div>

                    {/* Email */}
                    <div className="auth-field">
                        <label className="auth-label">Email Address</label>
                        <input
                            id="signup-email"
                            type="email"
                            name="email"
                            className="auth-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    {/* Password */}
                    <div className="auth-field">
                        <label className="auth-label">Password</label>
                        <div className="auth-input-wrapper">
                            <input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="auth-input"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Strength Bar */}
                        {formData.password && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="strength-wrapper">
                                <div className="strength-bar-track">
                                    <motion.div
                                        className="strength-bar-fill"
                                        animate={{ width: strength.width, backgroundColor: strength.color }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                                <span className="strength-label" style={{ color: strength.color }}>
                                    {strength.label}
                                </span>
                            </motion.div>
                        )}

                        {/* Password Checklist */}
                        {formData.password && (
                            <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="password-checklist">
                                {passwordChecks.map(({ key, label }) => (
                                    <li key={key} className={`checklist-item ${strength.checks[key] ? 'pass' : 'fail'}`}>
                                        {strength.checks[key] ? <FaCheck /> : <FaTimes />}
                                        <span>{label}</span>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="auth-field">
                        <label className="auth-label">Confirm Password</label>
                        <div className="auth-input-wrapper">
                            <input
                                id="signup-confirm-password"
                                type={showConfirm ? 'text' : 'password'}
                                name="confirmPassword"
                                className={`auth-input ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'input-error' : ''} ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'input-success' : ''}`}
                                placeholder="Repeat your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowConfirm(!showConfirm)}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="field-error-text">Passwords do not match</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        id="signup-submit"
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? <span className="auth-spinner" /> : 'Create Account'}
                    </button>
                </form>

                <p className="auth-redirect-text">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Log In</Link>
                </p>
            </div>
        </motion.div>
    );
};

export default Signup;
