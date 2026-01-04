import { Link } from 'react-router-dom';
import { Instagram, Linkedin, MessageCircle, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            {/* Gradient Top Border */}
            <div className="footer-gradient-border"></div>

            <div className="footer-container">
                <div className="footer-top">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <Sparkles className="logo-icon" size={24} />
                            <span>CourseHub</span>
                        </Link>
                        <p className="footer-tagline">
                            Empowering learners worldwide with high-quality courses from expert instructors.
                        </p>

                        {/* Social Media Icons */}
                        <div className="social-icons">
                            <a
                                href="https://www.instagram.com/jeettt_2311__?igsh=MWc3cW45ZnI1b3F5bA%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link instagram"
                                title="Follow us on Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="http://linkedin.com/in/jeet-bhalodi-72a379344"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link linkedin"
                                title="Connect on LinkedIn"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="https://wa.me/918200663823"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link whatsapp"
                                title="Chat on WhatsApp"
                            >
                                <MessageCircle size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links-section">
                        <div className="link-column">
                            <h4>Quick Links</h4>
                            <Link to="/">Home</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact Us</Link>
                        </div>
                        <div className="link-column">
                            <h4>Support</h4>
                            <Link to="/contact">Help Center</Link>
                            <Link to="/contact">FAQs</Link>
                            <Link to="/contact">Get in Touch</Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact">
                        <h4>Get in Touch</h4>
                        <div className="contact-item">
                            <Mail size={16} />
                            <span>support@coursehub.com</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={16} />
                            <span>+91 8200663823</span>
                        </div>
                        <div className="contact-item">
                            <MapPin size={16} />
                            <span>India</span>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <div className="copyright">
                        © {new Date().getFullYear()} <span className="brand-highlight">CourseHub</span>. All rights reserved.
                    </div>
                    <div className="footer-bottom-linkfor learners everywheres">
                        <span>Made with Jeet❤️ </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
