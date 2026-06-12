import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const SocialCard = ({ name, url, iconName }) => {
    return (
        <motion.a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-card"
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1rem 1.5rem', 
                background: 'rgba(16, 29, 54, 0.7)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px', 
                color: 'var(--text-primary)', 
                textDecoration: 'none',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
            }}
            whileHover={{ 
                scale: 1.03,
                borderColor: 'var(--accent-cyan)',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)'
            }}
            whileTap={{ scale: 0.98 }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img 
                    src={`/assets/${iconName}`} 
                    alt={`${name} logo`} 
                    style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }} 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/28x28.png?text=Logo';
                    }}
                />
                <span style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{name}</span>
            </div>
            <motion.div
                initial={{ opacity: 0.5, x: -5 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
            >
                <ExternalLink size={20} color="var(--accent-cyan)" />
            </motion.div>
        </motion.a>
    );
};

export default SocialCard;
