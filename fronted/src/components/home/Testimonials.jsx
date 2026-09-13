import React, { useState } from 'react';
import { Quote, ArrowRight, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
        {
            text: "CourseHub was rated the most popular online course or certification program for learning how to code according to StackOverflow's 2023 Developer survey.",
            author: "StackOverflow",
            role: "37,076 responses collected",
            link: "View Web Development courses",
            avatar: "📊",
            rating: 5
        },
        {
            text: "CourseHub was truly a game-changer and a great guide for me as we brought Dimensional to life.",
            author: "Alvin Lim",
            role: "Technical Co-Founder, CTO at Dimensional",
            link: "View this iOS & Swift course",
            avatar: "👨‍💻",
            rating: 5
        },
        {
            text: "CourseHub gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.",
            author: "William A. Wachlin",
            role: "Partner Account Manager at AWS",
            link: "View this AWS course",
            avatar: "🚀",
            rating: 5
        },
        {
            text: "With CourseHub Business employees were able to marry the two together, technology and consultant soft skills to help drive their careers forward.",
            author: "Ian Stevens",
            role: "Head of Capability Development at Publicis Sapient",
            link: "Read full story",
            avatar: "💼",
            rating: 5
        }
    ];

    const nextTestimonial = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="testimonials-section">
            {/* Background Elements */}
            <div className="testimonials-bg-gradient"></div>
            <div className="testimonials-bg-pattern"></div>

            <div className="testimonials-container">
                {/* Header */}
                <div className="testimonials-header">
                    <div className="section-badge">
                        <Sparkles size={16} />
                        <span>Success Stories</span>
                    </div>
                    <h2>Transforming Lives Through Learning</h2>
                    <p>See how others are building their careers with CourseHub</p>
                </div>

                {/* Featured Testimonial */}
                <div className="featured-testimonial">
                    <div className="featured-card">
                        <div className="quote-decoration">
                            <Quote size={60} />
                        </div>

                        <div className="featured-content">
                            <div className="rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />
                                ))}
                            </div>
                            <p className="featured-text">"{testimonials[activeIndex].text}"</p>

                            <div className="featured-author">
                                <div className="author-avatar">
                                    {testimonials[activeIndex].avatar}
                                </div>
                                <div className="author-info">
                                    <h4>{testimonials[activeIndex].author}</h4>
                                    <span>{testimonials[activeIndex].role}</span>
                                </div>
                            </div>

                            <a href="#" className="featured-link">
                                {testimonials[activeIndex].link}
                                <ArrowRight size={16} />
                            </a>
                        </div>

                        {/* Navigation */}
                        <div className="testimonial-nav">
                            <button className="nav-btn" onClick={prevTestimonial}>
                                <ChevronLeft size={20} />
                            </button>
                            <div className="nav-dots">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`nav-dot ${i === activeIndex ? 'active' : ''}`}
                                        onClick={() => setActiveIndex(i)}
                                    />
                                ))}
                            </div>
                            <button className="nav-btn" onClick={nextTestimonial}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Side Cards Preview */}
                    <div className="testimonial-previews">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className={`preview-card ${i === activeIndex ? 'active' : ''}`}
                                onClick={() => setActiveIndex(i)}
                            >
                                <div className="preview-avatar">{t.avatar}</div>
                                <div className="preview-info">
                                    <h5>{t.author}</h5>
                                    <span>{t.role.split(',')[0]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
