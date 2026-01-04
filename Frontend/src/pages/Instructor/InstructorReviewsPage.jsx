import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { Star, MessageSquare, TrendingUp, Users } from 'lucide-react';
import './InstructorReviewsPage.css';

const InstructorReviewsPage = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchReviews();
        }
    }, [user]);

    const fetchReviews = async () => {
        try {
            const allReviews = await courseService.getAllReviews();
            setReviews(allReviews);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get initials and random color for avatar
    const getAvatarData = (name) => {
        const initials = name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        const charCode = name.charCodeAt(0) || 0;
        const color = colors[charCode % colors.length];

        return { initials, color };
    };

    // Render star rating
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                fill={i < rating ? '#fbbf24' : 'none'}
                color={i < rating ? '#fbbf24' : '#d1d5db'}
            />
        ));
    };

    // Calculate average rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    if (loading) return (
        <div className="reviews-page loading-state">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
        </div>
    );

    return (
        <div className="reviews-page">
            {/* Header */}
            <div className="reviews-header">
                <div>
                    <h1>Reviews Dashboard</h1>
                    <p>Monitor and manage student feedback across all courses.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="reviews-stats">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <MessageSquare size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{reviews.length}</span>
                        <span className="stat-label">Total Reviews</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                        <Star size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{avgRating}</span>
                        <span className="stat-label">Avg Rating</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{new Set(reviews.map(r => r.studentName)).size}</span>
                        <span className="stat-label">Unique Students</span>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="reviews-container">
                <h2 className="section-title">Recent Feedback</h2>
                {reviews.length > 0 ? (
                    <div className="reviews-grid">
                        {reviews.map(review => {
                            const { initials, color } = getAvatarData(review.studentName);
                            return (
                                <div key={review.id} className="review-card">
                                    <div className="review-card-header">
                                        <div className="reviewer-info">
                                            <div
                                                className="reviewer-avatar"
                                                style={{ backgroundColor: color }}
                                            >
                                                {initials}
                                            </div>
                                            <div>
                                                <span className="reviewer-name">{review.studentName}</span>
                                                <span className="review-course">{review.courseTitle}</span>
                                            </div>
                                        </div>
                                        <div className="review-rating">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <p className="review-comment">"{review.comment}"</p>
                                    <div className="review-date">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <MessageSquare size={40} />
                        </div>
                        <h3>No Reviews Yet</h3>
                        <p>Student reviews will appear here once they start providing feedback.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorReviewsPage;
