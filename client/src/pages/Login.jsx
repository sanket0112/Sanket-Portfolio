import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/users/login', formData);
            
            if (res.data.isAdmin) {
                localStorage.setItem('adminToken', res.data.token);
                toast.success('Welcome back, Admin!');
                navigate('/admin/dashboard');
            } else {
                localStorage.setItem('userToken', res.data.token);
                localStorage.setItem('userName', res.data.name);
                window.dispatchEvent(new Event('authChange'));
                toast.success(res.data.message || 'Welcome back!');
                navigate('/');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

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
                        <span style={{ fontSize: '1.5rem' }}>👋</span>
                    </div>
                    <h2 className="auth-title text-gradient">Welcome Back</h2>
                    <p className="auth-subtitle">Log in to your account</p>
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
                
                <form onSubmit={handleLogin} noValidate>
                    <div className="auth-field">
                        <label className="auth-label">Email Address</label>
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            className="auth-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            autoFocus
                        />
                    </div>
                    <div className="auth-field">
                        <label className="auth-label">Password</label>
                        <div className="auth-input-wrapper">
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="auth-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
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
                    </div>

                    <button
                        id="login-submit"
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? <span className="auth-spinner" /> : 'Log In'}
                    </button>
                </form>

                <p className="auth-redirect-text">
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">Sign Up</Link>
                </p>
            </div>
        </motion.div>
    );
};

export default Login;
