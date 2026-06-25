import React from 'react';
import { motion } from 'framer-motion';
import { socialLinksArray } from '../data/socialLinks';
import SocialCard from '../components/SocialCard';
import SkillsSection from '../components/SkillsSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
        >
            {/* Hero Section */}
            <section style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap-reverse', minHeight: '70vh' }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <motion.h4 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        style={{ color: 'var(--accent-cyan)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}
                    >
                        Hello World, I am
                    </motion.h4>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        style={{ fontSize: '4.5rem', marginBottom: '0.5rem', lineHeight: '1.1' }}
                    >
                        Patel Sanket
                    </motion.h1>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}
                        className="text-gradient"
                    >
                        AI/ML Engineer
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        style={{ marginBottom: '2.5rem', fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px' }}
                    >
                        A passionate AI/ML Engineer focused on Machine Learning, Data Science, Computer Vision, and Full Stack Development. Currently pursuing a Diploma in Information Technology while building real-world intelligent systems, know as ZeroKai.                    </motion.p>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <a href="/api/resume/download" className="btn btn-primary">
                            Download Resume
                        </a>
                        {localStorage.getItem('adminToken') ? (
                            <Link to="/admin/dashboard" className="btn btn-secondary" style={{ border: '1px solid var(--accent-purple)', color: 'var(--accent-purple)' }}>
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/contact" className="btn btn-secondary">
                                Contact Me
                            </Link>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '0.5rem' }}>Find me on:</span>
                        {socialLinksArray.map((link, index) => (
                            <a 
                                key={index} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: '36px',
                                    height: '36px',
                                    transition: 'transform 0.2s', 
                                    background: 'var(--glass-bg)', 
                                    borderRadius: '50%', 
                                    border: '1px solid var(--glass-border)',
                                    boxSizing: 'border-box'
                                }} 
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} 
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <img src={`/assets/${link.iconName}`} alt={link.name} style={{ width: '18px', height: '18px', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                            </a>
                        ))}
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
                    style={{ flex: '0.7', minWidth: '280px', display: 'flex', justifyContent: 'center' }}
                >
                    <div style={{ 
                        width: '320px', 
                        height: '320px', 
                        borderRadius: '50%', 
                        overflow: 'hidden',
                        border: '2px solid var(--glass-border)',
                        boxShadow: '0 0 40px rgba(0, 229, 255, 0.2)',
                        padding: '10px',
                        background: 'var(--glass-bg)'
                    }}>
                        <img 
                            src="/assets/profile.jpg" 
                            alt="Patel Sanket" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/320x320.png?text=Profile+Image';
                            }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* Social Links Section */}
            <section style={{ marginTop: '5rem' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1.5rem', 
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    {socialLinksArray.map((link, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + (index * 0.1) }}>
                            <SocialCard name={link.name} url={link.url} iconName={link.iconName} />
                        </motion.div>
                    ))}
                </div>
            </section>

            <ExperienceSection />
            <SkillsSection />
            <EducationSection />
            
        </motion.div>
    );
};

export default Home;
