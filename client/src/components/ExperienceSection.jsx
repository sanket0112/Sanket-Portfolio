import React from 'react';
import { motion } from 'framer-motion';

const ExperienceSection = () => {
    return (
        <section style={{ marginTop: '5rem' }}>
            <h2 className="section-title">Experience</h2>
            <div style={{ position: 'relative', borderLeft: '2px solid var(--accent-purple)', marginLeft: '1rem', paddingLeft: '2rem' }}>
                <motion.div 
                    className="glass-panel"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    style={{ position: 'relative' }}
                >
                    <div style={{
                        position: 'absolute',
                        left: '-2.6rem',
                        top: '2rem',
                        width: '1rem',
                        height: '1rem',
                        background: 'var(--accent-purple)',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px var(--accent-purple)'
                    }}></div>
                    
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Data Science Intern</h3>
                    <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>Brainy Beam</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>May 2025 - Present</p>
                    
                    <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <li>Applying Machine Learning algorithms to extract insights from datasets.</li>
                        <li>Developing and optimizing predictive models and data pipelines.</li>
                        <li>Collaborating with cross-functional teams to deploy intelligent solutions.</li>
                    </ul>
                    
                    <a 
                        href="https://drive.google.com/file/d/1i7xbHCFgWDn46yBRgIfjbqCGmXBktz-Z/view?usp=drive_link"
                        target="_blank" rel="noopener noreferrer"
                        className="btn"
                        style={{ display: 'inline-block', fontSize: '0.85rem', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', textDecoration: 'none' }}
                    >
                        View Internship Certificate ↗
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default ExperienceSection;
