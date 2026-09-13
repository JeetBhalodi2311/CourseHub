import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, MessageSquare, Clock, CheckCircle, Sparkles } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="hero-badge">
                    <MessageSquare size={16} />
                    <span>Get in Touch</span>
                </div>
                <h1>Contact Us</h1>
                <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </section>

            {/* Main Content */}
            <section className="contact-content">
                {/* Contact Form */}
                <div className="contact-form-section">
                    <div className="form-header">
                        <h2>Send us a message</h2>
                        <p>Fill out the form below and we'll get back to you shortly.</p>
                    </div>

                    {submitted ? (
                        <div className="success-message">
                            <CheckCircle size={48} />
                            <h3>Thank You!</h3>
                            <p>Your message has been sent successfully. We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    rows={5}
                                    required
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="submit-btn">
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    )}
                </div>

                {/* Contact Info */}
                <div className="contact-info-section">
                    <div className="info-card">
                        <div className="info-header">
                            <Sparkles className="header-icon" size={24} />
                            <h3>Contact Information</h3>
                        </div>
                        <p className="info-description">
                            Reach out to us through any of these channels. We're here to help!
                        </p>

                        <div className="info-items">
                            <div className="info-item">
                                <div className="info-icon">
                                    <MapPin size={20} />
                                </div>
                                <div className="info-content">
                                    <h4>Visit Us</h4>
                                    <p>123 Learning Way, Silicon Valley, CA 94025</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">
                                    <Phone size={20} />
                                </div>
                                <div className="info-content">
                                    <h4>Call Us</h4>
                                    <p>+91 8200663823</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">
                                    <Mail size={20} />
                                </div>
                                <div className="info-content">
                                    <h4>Email Us</h4>
                                    <p>support@coursehub.com</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">
                                    <Clock size={20} />
                                </div>
                                <div className="info-content">
                                    <h4>Working Hours</h4>
                                    <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.507640204439!3d37.757814996609724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1645564756836!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Office Map"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
