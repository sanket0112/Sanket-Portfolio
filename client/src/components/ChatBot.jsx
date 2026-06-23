import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaMinus } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import ChatWindow from './ChatWindow';
import { chatbotService } from '../services/chatbotService';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    // Load initial messages from localStorage on component mount
    useEffect(() => {
        const storedMessages = localStorage.getItem('zk_portfolio_chat');
        if (storedMessages) {
            try {
                setMessages(JSON.parse(storedMessages));
            } catch (error) {
                console.error('Failed to parse cached chat logs:', error);
            }
        }
    }, []);

    // Sync messages with localStorage
    const saveMessages = (newMessages) => {
        setMessages(newMessages);
        localStorage.setItem('zk_portfolio_chat', JSON.stringify(newMessages));
    };

    const handleSendMessage = async (text) => {
        const userMsg = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: text,
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, userMsg];
        saveMessages(updatedMessages);
        setIsTyping(true);

        try {
            // Map messages to format expected by backend (simple array of sender/text)
            const chatHistory = messages.map(msg => ({
                sender: msg.sender,
                text: msg.text
            }));

            const response = await chatbotService.sendChatMessage(text, chatHistory);
            
            const botMsg = {
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: response.reply,
                timestamp: new Date().toISOString()
            };

            saveMessages([...updatedMessages, botMsg]);
        } catch (error) {
            console.error('Chatbot API communication error:', error);
            
            // Trigger a beautiful visual error toast using react-hot-toast
            const errorMsgText = error.response?.data?.error || "Connection failed. Offline first-person mode activated.";
            toast.error(errorMsgText);

            const errorMsg = {
                id: `err-${Date.now()}`,
                sender: 'bot',
                text: "I'm having trouble connecting to my live AI service. But here is what I can tell you from my offline memory:\n\n* **Education**: I'm studying IT at Government Polytechnic Kheda (Sem 5, 7.82 CGPA).\n* **Internship**: I completed a two-week AI internship at Bharat Cares in collaboration with IBM SkillsBuild.\n* **Skills**: I know Python, C++, React.js, Tailwind CSS, Node.js, Express, MongoDB, MySQL, and AI/ML libraries.\n\nYou can also contact me directly at **ps213patelsanket@gmail.com** or call me at **+91 6352246501**.",
                timestamp: new Date().toISOString()
            };
            
            saveMessages([...updatedMessages, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleClearChat = () => {
        saveMessages([]);
        setIsMinimized(false);
        toast.success("Chat history cleared.");
    };

    const handleToggleChat = () => {
        if (isMinimized) {
            setIsMinimized(false);
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <>
            {/* Hot toast manager */}
            <Toaster position="top-right" reverseOrder={false} />

            {/* Floating Chat Button */}
            <motion.button
                onClick={handleToggleChat}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--gradient-ai)',
                    color: '#000',
                    border: 'none',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1001,
                    boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)'
                }}
            >
                {isOpen && !isMinimized ? (
                    <FaMinus size={22} />
                ) : (
                    <FaCommentDots size={24} />
                )}
            </motion.button>

            {/* Chat Window Container */}
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.25, cubicBezier: [0.4, 0, 0.2, 1] }}
                        style={{ position: 'fixed', bottom: '0', right: '0', zIndex: 1000 }}
                    >
                        <ChatWindow
                            messages={messages}
                            isTyping={isTyping}
                            onSendMessage={handleSendMessage}
                            onClose={() => setIsOpen(false)}
                            onMinimize={() => setIsMinimized(true)}
                            onClearChat={handleClearChat}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
