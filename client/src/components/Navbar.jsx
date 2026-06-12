import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const checkAuth = () => {
        const userToken = localStorage.getItem('userToken');
        const adminToken = localStorage.getItem('adminToken');
        const name = localStorage.getItem('userName');
        
        if (adminToken) {
            setIsLoggedIn(true);
            setIsAdmin(true);
            setUserName('Admin');
        } else if (userToken) {
            setIsLoggedIn(true);
            setIsAdmin(false);
            setUserName(name || 'User');
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
            setUserName('');
        }
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener('authChange', checkAuth);
        return () => window.removeEventListener('authChange', checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userName');
        checkAuth();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <span className="text-mono">&lt;</span>
                <span className="text-gradient">Patel Sanket</span>
                <span className="text-mono"> /&gt;</span>
            </div>
            <ul className="nav-links">
                <li><NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
                <li><NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Projects</NavLink></li>
                <li><NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink></li>
                
                {isLoggedIn ? (
                    <>
                        {isAdmin && (
                            <li><NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active text-mono" : "nav-link text-mono"} style={{ color: 'var(--accent-purple)' }}>Dashboard</NavLink></li>
                        )}
                        <li><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '1rem' }}>Hi, {userName}</span></li>
                        <li><button onClick={handleLogout} className="btn" style={{ padding: '0.4rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} style={{ color: 'var(--accent-cyan)' }}>Login</NavLink></li>
                        <li><NavLink to="/signup" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} style={{ color: 'var(--accent-blue)' }}>Sign Up</NavLink></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
