import React from 'react';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import { projectService } from '../services/api';
import { FaGithub } from 'react-icons/fa';

const Projects = () => {
    const { data: dbProjects, loading, error } = useFetch(projectService.getAllProjects);

    const defaultProjects = [
        {
            _id: "p1",
            title: "Sanket-Portfolio",
            description: "A premium MERN stack portfolio featuring a futuristic glassmorphism UI, complete with an Admin Dashboard, User Management, and JWT Authentication.",
            technologies: ["MongoDB", "Express", "React", "Node.js"],
            githubLink: "https://github.com/sanket0112/Sanket-Portfolio"
        },
        {
            _id: "p2",
            title: "Shoe Store E-Commerce Website",
            description: "A fully responsive e-commerce platform for browsing and purchasing shoes.",
            technologies: ["HTML", "CSS", "JavaScript"],
            githubLink: "https://github.com/sanket0112/Shoes-Store-"
        },
        {
            _id: "p3",
            title: "Amazon Clone",
            description: "A pixel-perfect UI clone of the Amazon e-commerce platform homepage.",
            technologies: ["HTML", "CSS"],
            githubLink: "https://github.com/sanket0112/amazon-clone"
        },
        {
            _id: "p4",
            title: "Tic-Tac-Toe Game",
            description: "A classic interactive Tic-Tac-Toe game with winning logic and reset functionality.",
            technologies: ["HTML", "CSS", "JavaScript"],
            githubLink: "https://github.com/sanket0112/tic-tac-toe"
        },
        {
            _id: "p5",
            title: "Stone-Paper-Scissors",
            description: "An interactive rock-paper-scissors game played against a computer opponent.",
            technologies: ["HTML", "CSS", "JavaScript"],
            githubLink: "https://github.com/sanket0112/stone-paper-scissors"
        }
    ];

    const futureProjects = [
        "Resume ATS Checker",
        "AI Interview Assistant",
        "AI Career Roadmap Generator"
    ];

    const displayProjects = (dbProjects && dbProjects.length > 0) ? dbProjects : defaultProjects;

    const ProjectCard = ({ project, idx }) => (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel" 
            style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ height: '180px', background: 'var(--bg-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span className="text-gradient" style={{ fontSize: '3rem', opacity: 0.3 }}>&lt;/&gt;</span>
                )}
            </div>
            
            <div style={{ padding: '1.5rem', flex: '1', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem', color: 'var(--text-primary)' }}>{project.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: '1', fontSize: '0.95rem' }}>
                    {project.description}
                </p>
                
                {project.technologies && project.technologies.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {project.technologies.map((tech, idx) => (
                            <span key={idx} style={{ 
                                background: 'rgba(0, 229, 255, 0.1)', 
                                color: 'var(--accent-cyan)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                border: '1px solid rgba(0, 229, 255, 0.2)'
                            }}>
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                    {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: '1', padding: '0.6rem', fontSize: '0.9rem' }}>
                            Live Demo
                        </a>
                    )}
                    {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: '1', padding: '0.6rem', fontSize: '0.9rem' }}>
                            <FaGithub size={16} /> GitHub
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="section-title">Featured Projects</h1>
            
            {loading && <p style={{ color: 'var(--accent-cyan)' }}>Loading projects from database...</p>}
            
            <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
                {displayProjects.map((project, idx) => (
                    <ProjectCard key={project._id} project={project} idx={idx} />
                ))}
            </div>

            <h2 className="section-title" style={{ marginTop: '5rem' }}>Future AI/ML Pipeline</h2>
            <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
                {futureProjects.map((title, idx) => (
                    <motion.div 
                        key={idx}
                        className="glass-panel"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        style={{ borderStyle: 'dashed', textAlign: 'center', borderColor: 'var(--accent-purple)' }}
                    >
                        <div style={{ 
                            width: '40px', height: '40px', background: 'rgba(124, 58, 237, 0.1)', 
                            borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span style={{ color: 'var(--accent-purple)' }}>⏳</span>
                        </div>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>{title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Currently in research/planning phase.</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Projects;
