import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Star } from 'lucide-react';
import './CourseCard.css';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const navigateToCourse = () => {
        navigate(`/course/${course.id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(course);
        // Optional: Add visual feedback here or rely on cart count update
    };

    return (
        <div onClick={navigateToCourse} className="course-card">
            <div className="card-image">
                <img src={course.thumbnail} alt={course.title} />
            </div>
            <div className="card-content">
                <h3 className="course-title">{course.title}</h3>
                <div className="instructor-name">{course.instructorName}</div>
                <div className="course-rating">
                    <span className="rating-number">{course.rating}</span>
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < Math.floor(course.rating) ? "#e59819" : "none"}
                                color={i < Math.floor(course.rating) ? "#e59819" : "#e59819"}
                            />
                        ))}
                    </div>
                    <span className="review-count">({course.totalReviews})</span>
                </div>
                <div className="course-price">₹{course.price}</div>
                {course.bestseller && <div className="bestseller-badge">Bestseller</div>}
            </div>
            <button className="btn-add-to-cart-card" onClick={handleAddToCart}>
                Add to Cart
            </button>
        </div>
    );
};

export default CourseCard;
