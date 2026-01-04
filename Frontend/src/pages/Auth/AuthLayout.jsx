import React from 'react';
import { BookOpen, GraduationCap, Award } from 'lucide-react';
import './Auth.css';

const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-sidebar">
                <div className="auth-sidebar-content">
                    <div className="auth-brand">
                        <GraduationCap size={36} />
                        <h1>CourseHub</h1>
                    </div>

                    <div className="auth-floating-icons">
                        <div className="icon-bubble">📚</div>
                        <div className="icon-bubble">🎓</div>
                        <div className="icon-bubble">💡</div>
                    </div>

                    <div className="auth-hero-text">
                        <h2>Start Learning Today</h2>
                        <p>Join thousands of students mastering new skills with our expert-led courses.</p>
                    </div>

                    <div className="auth-stats">
                        <div className="auth-stat">
                            <div className="stat-value">50K+</div>
                            <div className="stat-label">Students</div>
                        </div>
                        <div className="auth-stat">
                            <div className="stat-value">200+</div>
                            <div className="stat-label">Courses</div>
                        </div>
                        <div className="auth-stat">
                            <div className="stat-value">4.9★</div>
                            <div className="stat-label">Rating</div>
                        </div>
                    </div>
                </div>
                <div className="auth-bg-pattern"></div>
            </div>
            <div className="auth-main">
                <div className="auth-content">
                    <div className="auth-header">
                        <h2>{title}</h2>
                        <p>{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
