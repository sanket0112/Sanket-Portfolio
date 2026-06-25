import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { messageService } from '../services/api';
import { socialLinksArray } from '../data/socialLinks';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await messageService.sendMessage(formData);
            setStatus({ type: 'success', msg: 'Message sent successfully! I will get back to you soon.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                msg: error.response?.data?.message || 'Failed to send message. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
        >
            <h1 style={{ marginBottom: '1rem', textAlign: 'center' }} className="section-title">Get In Touch</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                Interested in AI/ML solutions or full stack development? Let's connect!
            </p>

            <form onSubmit={handleSubmit} className="glass-panel">
                {status.msg && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ 
                            padding: '1rem', 
                            marginBottom: '1.5rem', 
                            borderRadius: '8px',
                            background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                            border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                            color: status.type === 'error' ? '#ef4444' : '#22c55e'
                        }}
                    >
                        {status.msg}
                    </motion.div>
                )}

                <div className="grid-cols-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} className="form-control" rows="6" required></textarea>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '1rem' }} 
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
                <p style={{ fontSize: '0.8rem', color: 'rgba(239, 68, 68, 0.7)', textAlign: 'center', marginTop: '1rem', fontStyle: 'italic' }}>
                    Currently this service is unavailable because funds are needed to run this section to send email.
                </p>
            </form>

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Or connect directly on:</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    {socialLinksArray.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 229, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                            <img 
                                src={`/assets/${link.iconName}`} 
                                alt={`${link.name} logo`} 
                                style={{ width: '20px', height: '20px', objectFit: 'contain' }} 
                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                            />
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Contact;
