import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Star, CheckCircle } from 'lucide-react';
import './CourseCard.css';

const CourseCard = ({ course, isEnrolled = false }) => {
    const navigate = useNavigate();
    const { addToCart, isInCart } = useCart();

    const navigateToCourse = () => {
        if (isEnrolled) {
            navigate(`/course/${course.id}/learn`);
        } else {
            navigate(`/course/${course.id}`);
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (isEnrolled || isInCart(course.id)) return;
        addToCart(course);
    };

    return (
        <div onClick={navigateToCourse} className="course-card">
            {/* Already Purchased Badge */}
            {isEnrolled && (
                <div className="purchased-badge">
                    <CheckCircle size={14} />
                    Already Purchased
                </div>
            )}

            <div className="card-image">
                <img src={course.thumbnail} alt={course.title} />
            </div>
            <div className="card-content">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-rating">
                    <span className="rating-number">{Number(course.rating || 0).toFixed(1)}</span>
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
                </div>
                <div className="course-price">₹{course.price}</div>
                {course.bestseller && <div className="bestseller-badge">Bestseller</div>}
            </div>

            {isEnrolled ? (
                <button className="btn-add-to-cart-card btn-enrolled" onClick={(e) => e.stopPropagation()}>
                    <CheckCircle size={16} /> Go to Course
                </button>
            ) : isInCart(course.id) ? (
                <button className="btn-add-to-cart-card btn-in-cart" onClick={(e) => e.stopPropagation()}>
                    ✓ In Cart
                </button>
            ) : (
                <button className="btn-add-to-cart-card" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            )}
        </div>
    );
};

export default CourseCard;
