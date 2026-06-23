import React from 'react';
import { motion } from 'framer-motion';

const SkillsSection = () => {
    const skillCategories = [
        {
            title: "Programming",
            skills: ["Python", "C++", "JavaScript", "HTML", "CSS", "SQL"]
        },
        {
            title: "AI/ML",
            skills: ["Machine Learning", "Deep Learning",  "OpenCV", "NLP", "EDA"]
        },
        {
            title: "Libraries",
            skills: ["NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn"]
        },
        {
            title: "Tools",
            skills: ["Git", "GitHub", "VS Code", "Jupyter Notebook", "Google Colab","JIRA"]
        }
    ];

    return (
        <section style={{ marginTop: '5rem' }}>
            <h2 className="section-title">Technical Skills</h2>
            <div className="grid-cols-2">
                {skillCategories.map((category, idx) => (
                    <motion.div 
                        key={idx} 
                        className="glass-panel"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>{category.title}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {category.skills.map((skill, sIdx) => (
                                <span 
                                    key={sIdx} 
                                    style={{
                                        background: 'rgba(0, 229, 255, 0.1)',
                                        color: 'var(--text-primary)',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem',
                                        border: '1px solid rgba(0, 229, 255, 0.2)'
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;
