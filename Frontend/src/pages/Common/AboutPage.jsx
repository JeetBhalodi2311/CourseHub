import React from 'react';
import { Target, Users, Award, Sparkles, ArrowRight, Globe, BookOpen, TrendingUp } from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>About CourseHub</span>
                    </div>
                    <h1>Improving Lives Through Learning</h1>
                    <p className="hero-subtitle">
                        CourseHub is the global marketplace for learning and instruction.
                        We connect millions of learners with world-class instructors.
                    </p>
                </div>
                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                        alt="CourseHub Team"
                    />
                    <div className="image-overlay"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stat-card">
                    <Globe className="stat-icon" size={32} />
                    <h3>100+</h3>
                    <p>Countries Reached</p>
                </div>
                <div className="stat-card">
                    <BookOpen className="stat-icon" size={32} />
                    <h3>15,000+</h3>
                    <p>Courses Available</p>
                </div>
                <div className="stat-card">
                    <Users className="stat-icon" size={32} />
                    <h3>1M+</h3>
                    <p>Active Learners</p>
                </div>
                <div className="stat-card">
                    <TrendingUp className="stat-icon" size={32} />
                    <h3>98%</h3>
                    <p>Success Rate</p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section">
                <div className="mission-content">
                    <div className="section-badge">
                        <Target size={16} />
                        <span>Our Mission</span>
                    </div>
                    <h2>Empowering Growth Through Knowledge</h2>
                    <p>
                        We help organizations of all types and sizes prepare for the path ahead — wherever it leads.
                        Our curated collection of business and technical courses help companies, governments, and
                        nonprofits go further by placing learning at the center of their strategies.
                    </p>
                    <div className="mission-features">
                        <div className="feature">
                            <Award className="feature-icon" size={24} />
                            <div>
                                <h4>Quality Content</h4>
                                <p>Expert-vetted courses from industry leaders</p>
                            </div>
                        </div>
                        <div className="feature">
                            <Users className="feature-icon" size={24} />
                            <div>
                                <h4>Global Community</h4>
                                <p>Connect with learners worldwide</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mission-visual">
                    <div className="visual-card">
                        <div className="card-glow"></div>
                        <Sparkles size={48} />
                        <h3>Learn. Grow. Succeed.</h3>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="section-header">
                    <div className="section-badge">
                        <Users size={16} />
                        <span>Our Team</span>
                    </div>
                    <h2>Meet the Leaders</h2>
                    <p>The visionaries behind CourseHub's success</p>
                </div>
                <div className="team-grid">
                    <div className="team-card">
                        <div className="team-image">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="CEO"
                            />
                            <div className="team-overlay">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                        <div className="team-info">
                            <h4>Sarah Jenkins</h4>
                            <span className="role">CEO & Co-founder</span>
                        </div>
                    </div>
                    <div className="team-card">
                        <div className="team-image">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="CTO"
                            />
                            <div className="team-overlay">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                        <div className="team-info">
                            <h4>David Chen</h4>
                            <span className="role">CTO & Co-founder</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
