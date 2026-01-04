import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import './InstructorDashboard.css'; // Reusing global dash styles

const InstructorCommunicationPage = () => {
    const [activeMessage, setActiveMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await contactService.getMessages();
                setMessages(data);
                if (data.length > 0) setActiveMessage(data[0]);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    return (
        <div className="dashboard-container" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <div className="dashboard-header" style={{ flexShrink: 0 }}>
                <div>
                    <h1 className="dashboard-title">Contact Messages</h1>
                    <p className="dashboard-subtitle">Messages from Contact Us form</p>
                </div>
            </div>

            <div className="admin-card" style={{ flex: 1, display: 'flex', padding: 0, overflow: 'hidden', height: '100%' }}>
                {/* Sidebar List */}
                <div style={{ width: 320, borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
                        <div className="search-box" style={{ width: '100%' }}>
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Search messages..." className="search-input" />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? <div style={{ padding: 20 }}>Loading...</div> : messages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => setActiveMessage(msg)}
                                style={{
                                    padding: '16px',
                                    display: 'flex',
                                    gap: 12,
                                    cursor: 'pointer',
                                    background: activeMessage?.id === msg.id ? '#f3f4f6' : 'transparent',
                                    borderBottom: '1px solid #f9fafb'
                                }}
                            >
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold' }}>
                                    {msg.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Detail Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {activeMessage ? (
                        <>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold' }}>
                                        {activeMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{activeMessage.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{activeMessage.email}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 16, color: '#6b7280' }}>
                                    <MoreVertical size={20} style={{ cursor: 'pointer' }} />
                                </div>
                            </div>

                            <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, background: '#f9fafb' }}>
                                <div style={{
                                    padding: '20px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    lineHeight: '1.6'
                                }}>
                                    {activeMessage.message}
                                    <div style={{ marginTop: 16, fontSize: '0.8rem', color: '#9ca3af', borderTop: '1px solid #f3f4f6', paddingTop: 8 }}>
                                        Sent on {new Date(activeMessage.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                            Select a message to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorCommunicationPage;
