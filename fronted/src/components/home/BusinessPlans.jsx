import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, BookOpen, DollarSign, Layers, CheckCircle2, Loader2, ShoppingCart } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { useCart } from '../../context/CartContext';
import { authService } from '../../services/authService';
import './BusinessPlans.css';

const BusinessPlans = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [categories, setCategories] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [catsData, coursesData] = await Promise.all([
                courseService.getCategories(),
                courseService.getAllCourses()
            ]);
            setCategories(catsData);
            setAllCourses(coursesData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            }
            return [...prev, categoryId];
        });
    };

    // Derived State
    const selectedCourseList = allCourses.filter(course =>
        selectedCategories.some(catId => {
            const cat = categories.find(c => c.categoryId === catId);
            return cat && course.category === cat.categoryName;
        })
    );

    const totalCourses = selectedCourseList.length;
    const totalPrice = selectedCourseList.reduce((sum, course) => sum + (course.price || 0), 0);

    const handleAddToCart = () => {
        const user = authService.getCurrentUser();
        if (!user) {
            alert("Please login to subscribe.");
            navigate('/login');
            return;
        }

        setProcessing(true);

        // Add all selected courses to cart
        selectedCourseList.forEach(course => {
            addToCart(course);
        });

        // Redirect to cart page
        setTimeout(() => {
            setProcessing(false);
            navigate('/cart');
        }, 500);
    };

    if (loading) {
        return (
            <div className="business-plans-container" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                <Loader2 className="animate-spin" size={48} color="#a435f0" />
            </div>
        );
    }

    return (
        <div className="business-plans-container">
            <div className="business-header">
                <h2>Unlock Unlimited Learning</h2>
                <p>Select your areas of interest and get instant access to entire catalogs. One click, endless knowledge.</p>
            </div>

            <div className="subscription-layout">
                {/* Left: Category Selection */}
                <div className="categories-grid">
                    {categories.map(cat => {
                        const isSelected = selectedCategories.includes(cat.categoryId);
                        // Calculate course count for this category
                        const courseCount = allCourses.filter(c => c.category === cat.categoryName).length;

                        return (
                            <div
                                key={cat.categoryId}
                                className={`category-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleCategory(cat.categoryId)}
                            >
                                <div className="selection-indicator">
                                    {isSelected && <Check size={14} />}
                                </div>

                                <div className="category-icon-wrapper">
                                    {/* Placeholder icon or dynamic if available */}
                                    <Layers size={24} color={isSelected ? 'white' : '#666'} />
                                </div>

                                <div className="category-info">
                                    <h3>{cat.categoryName}</h3>
                                    <div className="category-stats">
                                        <div className="stat-item">
                                            <BookOpen size={14} />
                                            <span>{courseCount} courses</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right: Summary & Action */}
                <div className="summary-panel">
                    <div className="summary-header">
                        <h3>Subscription Summary</h3>
                    </div>

                    <div className="summary-rows">
                        <div className="summary-row">
                            <span>Selected Categories</span>
                            <span>{selectedCategories.length}</span>
                        </div>
                        <div className="summary-row">
                            <span>Total Courses</span>
                            <span>{totalCourses}</span>
                        </div>
                        <div className="summary-row">
                            <span>Access Level</span>
                            <span>Lifetime</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Value</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        className="subscribe-btn"
                        disabled={selectedCategories.length === 0 || processing}
                        onClick={handleAddToCart}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Adding to Cart...
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={20} />
                                Add to Cart & Checkout
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>

    );
};

export default BusinessPlans;
