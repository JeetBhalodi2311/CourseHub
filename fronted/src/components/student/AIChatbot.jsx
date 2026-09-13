import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, Zap, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatApi } from '../../services/aiService';
import './AIChatbot.css';

const initialMessage = { role: 'assistant', content: 'Hey! 👋 I\'m your AI Course Assistant. Ask me anything about your enrolled courses, study materials, or learning progress!' };

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Load from local storage or use initial message
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chatHistory');
        return saved ? JSON.parse(saved) : [initialMessage];
    });

    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Save to local storage whenever messages change
    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const clearHistory = () => {
        setMessages([initialMessage]);
    };

    const suggestions = [
        "What is my progress?",
        "Help me with this topic",
        "Summarize the last lecture"
    ];

    const handleSuggestionClick = (text) => {
        setInputText(text);
        handleSendMsg(text);
    };

    const handleSendMsg = async (text) => {
        if (!text.trim()) return;

        const userMessage = { role: 'user', content: text };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setInputText('');
        setIsLoading(true);

        const context = `Current Page Path: ${window.location.pathname}`;
        // Send history excluding the current user message, which is sent as the main message
        // Or we can just send the current message and the history prior to it.
        const historyToSend = messages; 

        try {
            const response = await chatApi.sendMessage(text, context, historyToSend);
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

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        handleSendMsg(inputText);
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
                                <div style={{display: 'flex', gap: '8px'}}>
                                    <button
                                        onClick={clearHistory}
                                        className="clear-history-button"
                                        title="Clear Chat History"
                                    >
                                        <Trash2 className="w-5 h-5 text-gray-200" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="close-button"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
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
                                    <div className="message-bubble markdown-body">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
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
                            
                            {messages.length === 1 && !isLoading && (
                                <div className="suggestions-container">
                                    {suggestions.map((sug, i) => (
                                        <button key={i} onClick={() => handleSuggestionClick(sug)} className="suggestion-chip">
                                            {sug}
                                        </button>
                                    ))}
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
