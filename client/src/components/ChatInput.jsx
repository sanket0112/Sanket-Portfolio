import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';

const ChatInput = ({ onSendMessage, disabled }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !disabled) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem',
            borderTop: '1px solid var(--glass-border)',
            background: 'rgba(7, 17, 31, 0.4)',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px'
        }}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={disabled}
                placeholder={disabled ? "Please wait..." : "Type your message..."}
                style={{
                    flex: 1,
                    background: 'rgba(7, 17, 31, 0.6)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-cyan)';
                    e.target.style.boxShadow = '0 0 8px rgba(0, 229, 255, 0.15)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'var(--glass-border)';
                    e.target.style.boxShadow = 'none';
                }}
            />
            <button
                type="submit"
                disabled={!inputValue.trim() || disabled}
                style={{
                    background: inputValue.trim() && !disabled ? 'var(--gradient-ai)' : 'rgba(56, 189, 248, 0.1)',
                    color: inputValue.trim() && !disabled ? '#000' : 'rgba(255, 255, 255, 0.3)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() && !disabled ? 'pointer' : 'default',
                    transition: 'all 0.3s ease'
                }}
            >
                <IoSend size={16} />
            </button>
        </form>
    );
};

export default ChatInput;
