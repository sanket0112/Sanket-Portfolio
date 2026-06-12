import React from 'react';
import { socialLinksArray } from '../data/socialLinks';

const Footer = () => {
    return (
        <footer className="footer">
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {socialLinksArray.map((link, index) => (
                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '500' }}>
                        {link.name}
                    </a>
                ))}
            </div>
            <p>&copy; {new Date().getFullYear()} Patel Sanket. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
