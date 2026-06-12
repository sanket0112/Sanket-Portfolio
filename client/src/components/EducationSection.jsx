import React from 'react';
import { motion } from 'framer-motion';

const EducationSection = () => {
    return (
        <section style={{ marginTop: '5rem' }}>
            <div className="grid-cols-2">
                <div>
                    <h2 className="section-title">Education</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <motion.div className="glass-panel" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h3 style={{ color: 'var(--text-primary)' }}>Diploma in Information Technology</h3>
                            <h4 style={{ color: 'var(--accent-cyan)' }}>Government Polytechnic Kheda</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Current Semester: 5 | CGPA: 7.82</p>
                        </motion.div>

                        <motion.div className="glass-panel" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h3 style={{ color: 'var(--text-primary)' }}>SSC</h3>
                            <h4 style={{ color: 'var(--accent-cyan)' }}>Eklavya Education Campus</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Score: 71.33%</p>
                        </motion.div>
                    </div>
                </div>

                <div>
                    <h2 className="section-title">Certifications</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <motion.a 
                            href="https://udemy-certificate.s3.amazonaws.com/image/UC-251fa98e-9072-439e-a339-eefade72fcc0.jpg?v=1753369733000"
                            target="_blank" rel="noopener noreferrer"
                            className="glass-panel" 
                            initial={{ opacity: 0 }} 
                            whileInView={{ opacity: 1 }} 
                            viewport={{ once: true }}
                            style={{ display: 'block', textDecoration: 'none' }}
                        >
                            <h3 style={{ color: 'var(--accent-blue)' }}>Mastering Python Programming</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Issued by: Udemy</p>
                            <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '0.5rem', display: 'inline-block' }}>View Certificate ↗</span>
                        </motion.a>

                        <motion.a 
                            href="https://drive.google.com/file/d/1iQG-iGDEtIexCwsPL86nE82TUMSoHqYe/view"
                            target="_blank" rel="noopener noreferrer"
                            className="glass-panel" 
                            initial={{ opacity: 0 }} 
                            whileInView={{ opacity: 1 }} 
                            viewport={{ once: true }}
                            style={{ display: 'block', textDecoration: 'none' }}
                        >
                            <h3 style={{ color: 'var(--accent-blue)' }}>CCC Certificate</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Issued by: NIELIT</p>
                            <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '0.5rem', display: 'inline-block' }}>View Certificate ↗</span>
                        </motion.a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EducationSection;
