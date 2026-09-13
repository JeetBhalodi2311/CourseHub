import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Sparkles, CheckCircle, MessageSquare, Clock } from 'lucide-react';
import './ContactSection.css';

import { contactService } from '../../services/contactService';

const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await contactService.sendMessage({
                name: formData.name,
                email: formData.email,
                message: formData.message
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: MapPin,
            label: "Visit Us",
            value: "Darshan University, Rajkot, Gujarat",
            color: "#667eea"
        },
        {
            icon: Phone,
            label: "Call Us",
            value: "+91 82006 63823",
            color: "#10b981"
        },
        {
            icon: Mail,
            label: "Email Us",
            value: "coursehub@gmail.com",
            color: "#f59e0b"
        },
        {
            icon: Clock,
            label: "Working Hours",
            value: "Mon - Fri: 9:00 AM - 6:00 PM",
            color: "#8b5cf6"
        }
    ];

    return (
        <section className="contact-section">
            {/* Background Effects */}
            <div className="contact-bg-gradient"></div>
            <div className="contact-glow contact-glow-1"></div>
            <div className="contact-glow contact-glow-2"></div>

            <div className="contact-container">
                {/* Header */}
                <div className="contact-header">
                    <div className="contact-badge">
                        <MessageSquare size={16} />
                        <span>Contact Us</span>
                    </div>
                    <h2><span className="text-gradient">Get in Touch</span></h2>
                    <p>Have questions about our enterprise plans or need technical support? We're here to help you grow.</p>
                </div>

                <div className="contact-layout">
                    {/* Left Panel: Info & Map */}
                    <div className="contact-info-panel">
                        <div className="info-cards">
                            {contactInfo.map((info, i) => (
                                <div
                                    key={i}
                                    className="info-card"
                                    style={{ '--accent': info.color }}
                                >
                                    <div className="info-icon">
                                        <info.icon size={20} />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">{info.label}</span>
                                        <strong className="info-value">{info.value}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="map-wrapper">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.643384210344!2d70.7825243142691!3d22.43065368525595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c7a3ba783351%3A0x28dc6eea8324e9d2!2sDarshan%20University!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Location Map"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="contact-form-panel">
                        <div className="form-header">
                            <Sparkles size={20} className="form-icon" />
                            <h3>Send us a message</h3>
                        </div>
                        <p className="form-subtitle">Fill out the form below and we'll get back to you shortly.</p>

                        {submitted ? (
                            <div className="success-message">
                                <div className="success-icon">
                                    <CheckCircle size={48} />
                                </div>
                                <h3>Thank you!</h3>
                                <p>Your message has been sent successfully. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea
                                        placeholder="How can we help you?"
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-submit" disabled={isLoading}>
                                    <Send size={18} />
                                    <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
