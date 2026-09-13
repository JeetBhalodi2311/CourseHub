import React from 'react';
import { ArrowRight, Award, Shield, Sparkles, CheckCircle, ExternalLink } from 'lucide-react';
import './Certifications.css';

const Certifications = () => {
    const certifications = [
        {
            name: "CompTIA",
            icon: "🛡️",
            description: "Industry standard for IT fundamentals, networking, and cybersecurity skills.",
            color: "#ef4444",
            courses: "45+ Courses"
        },
        {
            name: "AWS",
            icon: "☁️",
            description: "Validate expertise in cloud architecture, machine learning, and development.",
            color: "#f59e0b",
            courses: "60+ Courses"
        },
        {
            name: "PMI",
            icon: "📊",
            description: "Gold standard for project, program, and portfolio management professionals.",
            color: "#10b981",
            courses: "30+ Courses"
        },
        {
            name: "Google",
            icon: "🔍",
            description: "Certifications for cloud, data analytics, and digital marketing expertise.",
            color: "#3b82f6",
            courses: "50+ Courses"
        }
    ];

    const features = [
        "Expert-led comprehensive courses",
        "Practice tests with real exam questions",
        "Special offers on exam vouchers",
        "Lifetime access to materials"
    ];

    return (
        <section className="certifications-section">
            {/* Background */}
            <div className="cert-bg-gradient"></div>
            <div className="cert-glow cert-glow-1"></div>
            <div className="cert-glow cert-glow-2"></div>

            <div className="certifications-container">
                {/* Left Content */}
                <div className="cert-content">
                    <div className="cert-badge">
                        <Award size={16} />
                        <span>Certifications</span>
                    </div>

                    <h2>Get Certified and Get Ahead in Your Career</h2>

                    <p className="cert-description">
                        Prep for globally recognized certifications with comprehensive courses,
                        practice tests, and special offers on exam vouchers.
                    </p>

                    <div className="cert-features">
                        {features.map((feature, i) => (
                            <div key={i} className="cert-feature">
                                <CheckCircle size={18} />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <a href="#" className="cert-cta">
                        <span>Explore All Certifications</span>
                        <ArrowRight size={20} />
                    </a>
                </div>

                {/* Right - Certification Cards */}
                <div className="cert-cards-grid">
                    {certifications.map((cert, i) => (
                        <div
                            key={i}
                            className="cert-card"
                            style={{ '--accent-color': cert.color }}
                        >
                            <div className="cert-card-header">
                                <div className="cert-icon">{cert.icon}</div>
                                <div className="cert-courses">{cert.courses}</div>
                            </div>
                            <h3>{cert.name}</h3>
                            <p>{cert.description}</p>
                            <a href="#" className="cert-card-link">
                                View Courses
                                <ExternalLink size={14} />
                            </a>
                            <div className="cert-card-glow"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="cert-stats">
                <div className="stat">
                    <Sparkles size={24} />
                    <div>
                        <h4>50,000+</h4>
                        <span>Certified Professionals</span>
                    </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                    <Shield size={24} />
                    <div>
                        <h4>98%</h4>
                        <span>Pass Rate</span>
                    </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                    <Award size={24} />
                    <div>
                        <h4>200+</h4>
                        <span>Certification Programs</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Certifications;
