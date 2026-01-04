import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, Star, Users, Award, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
    return (
        <section className="hero-container">
            {/* Background Elements */}
            <div className="hero-bg-gradient"></div>
            <div className="hero-bg-grid"></div>
            <div className="hero-glow hero-glow-1"></div>
            <div className="hero-glow hero-glow-2"></div>

            <div className="hero-inner">
                <div className="hero-content">
                    {/* Badge */}
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        <span>No. 1 Learning Platform</span>
                        <Sparkles size={14} className="badge-sparkle" />
                    </div>

                    {/* Title */}
                    <h1 className="hero-title">
                        Unlock Your Potential with{' '}
                        <span className="text-gradient">Expert-Led</span> Courses
                    </h1>

                    {/* Description */}
                    <p className="hero-description">
                        Access 5000+ courses from top instructors. Master new skills in programming,
                        design, business, and more. Start your journey today.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-actions">
                        <Link to="/register" className="btn-hero-primary">
                            <span>Get Started</span>
                            <ArrowRight size={20} />
                        </Link>
                        <button className="btn-hero-secondary">
                            <PlayCircle size={20} />
                            <span>Watch Demo</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Users size={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">50k+</span>
                                <span className="stat-label">STUDENTS</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <BookOpen size={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">120+</span>
                                <span className="stat-label">INSTRUCTOR</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Star size={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">4.9</span>
                                <span className="stat-label">RATING</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Side */}
                <div className="hero-visual">
                    {/* Main Image */}
                    <div className="hero-image-wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Learning Platform"
                            className="hero-image"
                        />
                        <div className="image-overlay"></div>
                    </div>

                    {/* Floating Card - Expert Tutors */}
                    <div className="floating-card expert-card">
                        <div className="floating-card-glow"></div>
                        <div className="card-icon-wrapper">
                            <Award size={24} />
                        </div>
                        <div className="card-content">
                            <h4>Expert Tutors</h4>
                            <p>Learn from the best</p>
                        </div>
                    </div>

                    {/* Floating Card - Trending */}
                    <div className="floating-card trending-card">
                        <div className="card-icon-wrapper small">
                            <TrendingUp size={18} />
                        </div>
                        <span>+28% Growth</span>
                    </div>

                    {/* Decorative Elements */}
                    <div className="visual-ring ring-1"></div>
                    <div className="visual-ring ring-2"></div>
                </div>
            </div>

        </section>
    );
};

export default HeroSection;
