import React from 'react';
import { Target, Heart, Globe, Users, Award, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import './AboutSection.css';

const AboutSection = () => {
    const stats = [
        { value: "50K+", label: "Active Students" },
        { value: "120+", label: "Expert Instructors" },
        { value: "5000+", label: "Courses Available" },
        { value: "98%", label: "Success Rate" }
    ];

    const values = [
        {
            icon: Target,
            title: "Our Mission",
            description: "To create new possibilities for people and organizations everywhere through quality education.",
            color: "#667eea"
        },
        {
            icon: Heart,
            title: "Our Values",
            description: "We believe in the power of learning to transform lives, careers, and businesses.",
            color: "#f093fb"
        },
        {
            icon: Globe,
            title: "Global Reach",
            description: "Connecting millions of learners with expert instructors worldwide, 24/7 access.",
            color: "#10b981"
        }
    ];

    return (
        <section className="about-section">
            {/* Background Effects */}
            <div className="about-bg-gradient"></div>
            <div className="about-glow about-glow-1"></div>
            <div className="about-glow about-glow-2"></div>

            <div className="about-container">
                {/* Header */}
                <div className="about-header">
                    <div className="about-badge">
                        <Sparkles size={16} />
                        <span>Who We Are</span>
                    </div>
                    <h2>Empowering the World to <span className="text-gradient">Learn</span></h2>
                    <p>
                        We help organizations of all types and sizes prepare for the path ahead.
                        Our curated collection of business and technical courses help companies
                        and individuals go further than they ever thought possible.
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="about-stats">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-item">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="about-content">
                    {/* Image Side */}
                    <div className="about-visual">
                        <div className="image-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                                alt="Our Team"
                            />
                            <div className="image-overlay"></div>
                        </div>

                        {/* Floating Card */}
                        <div className="floating-about-card">
                            <div className="card-icon">
                                <Award size={24} />
                            </div>
                            <div className="card-content">
                                <h4>Industry Leading</h4>
                                <p>Rated #1 Learning Platform</p>
                            </div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="about-text">
                        <h3>Improving Lives Through Learning</h3>
                        <p className="about-description">
                            CourseHub is a global marketplace for learning and instruction.
                            We connect students all over the world to the best instructors,
                            helping individuals reach their goals and pursue their dreams.
                        </p>

                        <div className="feature-list">
                            <div className="feature-item">
                                <CheckCircle size={20} />
                                <span>Expert-led comprehensive courses</span>
                            </div>
                            <div className="feature-item">
                                <CheckCircle size={20} />
                                <span>Lifetime access to all materials</span>
                            </div>
                            <div className="feature-item">
                                <CheckCircle size={20} />
                                <span>Industry-recognized certifications</span>
                            </div>
                        </div>

                        <a href="#courses" className="about-cta">
                            <span>Explore Courses</span>
                            <ArrowRight size={18} />
                        </a>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="values-section">
                    <h3>What Drives Us</h3>
                    <div className="values-grid">
                        {values.map((value, i) => (
                            <div key={i} className="value-card" style={{ '--accent': value.color }}>
                                <div className="value-icon">
                                    <value.icon size={28} />
                                </div>
                                <h4>{value.title}</h4>
                                <p>{value.description}</p>
                                <div className="value-glow"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
