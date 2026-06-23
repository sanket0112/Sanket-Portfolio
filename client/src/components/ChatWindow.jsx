import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import { IoClose, IoTrashOutline, IoRemoveOutline } from 'react-icons/io5';

const ChatWindow = ({
    messages,
    isTyping,
    onSendMessage,
    onClose,
    onMinimize,
    onClearChat
}) => {
    const messagesEndRef = useRef(null);

    // Scroll to bottom whenever messages or typing state changes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div style={{
            width: '380px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '520px',
            maxHeight: 'calc(100vh - 8rem)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            bottom: '5.5rem',
            right: '2rem',
            zIndex: 1000,
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            border: '1px solid var(--glass-border)',
            background: 'rgba(11, 22, 40, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            {/* Header */}
            <div style={{
                padding: '0.85rem 1.2rem',
                background: 'rgba(7, 17, 31, 0.7)',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'between',
                width: '100%'
            }}>
                {/* Bot Profile Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'var(--gradient-ai)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: '#000'
                        }}>
                            ZK
                        </div>
                        {/* Pulse dot indicator */}
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#10b981',
                            border: '2px solid #07111F',
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            boxShadow: '0 0 8px #10b981'
                        }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.2' }}>ZeroKai AI</span>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Online
                        </span>
                    </div>
                </div>

                {/* Header Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button 
                        onClick={onClearChat} 
                        title="Clear conversation" 
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <IoTrashOutline size={18} />
                    </button>
                    <button 
                        onClick={onMinimize} 
                        title="Minimize" 
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <IoRemoveOutline size={20} />
                    </button>
                    <button 
                        onClick={onClose} 
                        title="Close" 
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <IoClose size={20} />
                    </button>
                </div>
            </div>

            {/* Conversation Feed */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.2rem 0.5rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Greeting / Onboarding panel */}
                {messages.length === 0 && (
                    <div style={{
                        padding: '1.5rem 1rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        <div style={{ fontSize: '2rem' }}>🤖</div>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Ask about Patel Sanket</h4>
                        <p style={{ margin: 0, opacity: 0.8 }}>
                            I can tell you about Sanket's academic credentials, data science internship, certifications, projects, coding profiles, and contact details.
                        </p>
                    </div>
                )}

                {/* Render chat history */}
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}

                {/* Bouncing Typing Indicator */}
                {isTyping && (
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        padding: '0 1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0, 229, 255, 0.15)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--accent-cyan)',
                            flexShrink: 0
                        }}>
                            🤖
                        </div>
                        <div className="glass-panel" style={{
                            padding: '0.6rem 1rem',
                            borderRadius: '16px 16px 16px 2px',
                            background: 'var(--glass-bg)',
                            borderColor: 'var(--glass-border)',
                            boxShadow: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            width: 'fit-content'
                        }}>
                            <div className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'bounce 1.3s infinite ease-in-out', animationDelay: '0s' }}></div>
                            <div className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'bounce 1.3s infinite ease-in-out', animationDelay: '0.15s' }}></div>
                            <div className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'bounce 1.3s infinite ease-in-out', animationDelay: '0.3s' }}></div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions Panel (Always accessible at bottom of list) */}
            <SuggestedQuestions onSelectQuestion={onSendMessage} />

            {/* Input Bar */}
            <ChatInput onSendMessage={onSendMessage} disabled={isTyping} />

            {/* Custom styling injected into document */}
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .typing-dot {
                    display: inline-block;
                }
            `}</style>
        </div>
    );
};

export default ChatWindow;
