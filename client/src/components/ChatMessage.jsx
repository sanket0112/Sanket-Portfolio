import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FaUser, FaRobot } from 'react-icons/fa';

const ChatMessage = ({ message }) => {
    const isUser = message.sender === 'user';
    
    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '1rem',
            padding: '0 0.5rem',
            width: '100%'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                gap: '0.75rem',
                maxWidth: '85%'
            }}>
                {/* Avatar Icon */}
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isUser ? 'rgba(124, 58, 237, 0.2)' : 'rgba(0, 229, 255, 0.15)',
                    border: `1px solid ${isUser ? 'var(--accent-purple)' : 'var(--accent-cyan)'}`,
                    color: isUser ? 'var(--accent-purple)' : 'var(--accent-cyan)',
                    flexShrink: 0,
                    marginTop: '2px',
                    fontSize: '0.9rem'
                }}>
                    {isUser ? <FaUser size={14} /> : <FaRobot size={14} />}
                </div>

                {/* Message Bubble */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                }}>
                    <div className="glass-panel" style={{
                        padding: '0.75rem 1rem',
                        borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        background: isUser ? 'rgba(12, 22, 39, 0.7)' : 'var(--glass-bg)',
                        borderColor: isUser ? 'rgba(124, 58, 237, 0.3)' : 'var(--glass-border)',
                        boxShadow: 'none',
                        fontSize: '0.9rem',
                        lineHeight: '1.45',
                        wordBreak: 'break-word',
                        color: 'var(--text-primary)',
                        textAlign: 'left'
                    }}>
                        {isUser ? (
                            <span style={{ whiteSpace: 'pre-wrap' }}>{message.text}</span>
                        ) : (
                            <div className="markdown-content" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                <ReactMarkdown
                                    components={{
                                        // Open all links in a new tab
                                        a: ({ href, children }) => (
                                            <a href={href} target="_blank" rel="noopener noreferrer" style={{
                                                color: 'var(--accent-cyan)',
                                                textDecoration: 'underline',
                                                fontWeight: '500'
                                            }}>
                                                {children}
                                            </a>
                                        ),
                                        p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
                                        ul: ({ children }) => <ul style={{ paddingLeft: '1.2rem', margin: '0.25rem 0' }}>{children}</ul>,
                                        ol: ({ children }) => <ol style={{ paddingLeft: '1.2rem', margin: '0.25rem 0' }}>{children}</ol>,
                                        li: ({ children }) => <li style={{ marginBottom: '0.2rem' }}>{children}</li>,
                                        code: ({ children }) => (
                                            <code style={{
                                                background: 'rgba(7, 17, 31, 0.6)',
                                                padding: '2px 4px',
                                                borderRadius: '4px',
                                                fontSize: '0.85em',
                                                border: '1px solid var(--glass-border)',
                                                color: 'var(--accent-blue)'
                                            }}>
                                                {children}
                                            </code>
                                        )
                                    }}
                                >
                                    {message.text}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                    {/* Timestamp */}
                    <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.25rem',
                        padding: '0 0.25rem',
                        opacity: '0.7'
                    }}>
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
