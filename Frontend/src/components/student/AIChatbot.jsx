import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, Zap } from 'lucide-react';
import { chatApi } from '../../services/aiService';
import './AIChatbot.css';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hey! 👋 I\'m your AI Course Assistant. Ask me anything about your enrolled courses, study materials, or learning progress!' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = { role: 'user', content: inputText };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await chatApi.sendMessage(userMessage.content);
            const botMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            let msg = 'Sorry, I encountered an error. Please try again.';
            if (error.response?.status === 429) {
                msg = '⏳ Rate limit reached. Please wait about 1 minute and try again.';
            } else if (error.response?.data?.response) {
                msg = error.response.data.response;
            }
            const errorMessage = { role: 'assistant', content: msg };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Premium Floating Toggle Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="chatbot-floating-btn group"
                    >
                        <div className="chatbot-btn-overlay"></div>
                        <Zap className="chatbot-btn-icon" />
                        <div className="chatbot-status-dot"></div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Modern Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="chatbot-container"
                    >
                        {/* Header */}
                        <div className="chatbot-header">
                            <div className="header-pattern"></div>
                            <div className="header-content">
                                <div className="bot-profile">
                                    <div className="bot-icon-box">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="bot-details">
                                        <h3>Course Assistant</h3>
                                        <p className="bot-powered-by">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ display: 'inline-block' }}></span>
                                            Powered by Gemini
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="close-button"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="messages-area">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`message-row ${msg.role === 'user' ? 'user' : 'assistant'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="bot-msg-icon">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div className="message-bubble">
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="message-row assistant">
                                    <div className="bot-msg-icon">
                                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                                    </div>
                                    <div className="loading-bubble">
                                        <div className="dot" style={{ animationDelay: '0s' }}></div>
                                        <div className="dot" style={{ animationDelay: '0.15s' }}></div>
                                        <div className="dot" style={{ animationDelay: '0.3s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="input-area">
                            <div className="input-container">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type your message..."
                                    className="chat-input"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="send-button"
                                >
                                    <Send className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatAssistant;
