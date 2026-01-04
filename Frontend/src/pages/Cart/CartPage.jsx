import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Shield, Clock, Award, Star, ShoppingCart, Tag, CheckCircle, X } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    // Valid coupons
    const validCoupons = {
        'COURSEHUB2311': { discount: 1000, name: 'CourseHub Flat ₹1000' }
    };

    const handleApplyCoupon = () => {
        setCouponError('');
        const code = couponCode.trim().toUpperCase();

        if (validCoupons[code]) {
            setAppliedCoupon({ code, ...validCoupons[code] });
            setCouponCode('');
        } else {
            setCouponError('Invalid coupon code');
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError('');
    };

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsCheckoutOpen(true);
    };

    // Calculate tax and total
    const subtotal = cartTotal;
    const discount = appliedCoupon ? Math.min(appliedCoupon.discount, subtotal) : 0;
    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.18; // 18% GST on discounted amount
    const total = discountedSubtotal + tax;

    return (
        <div className="cart-page">
            <h1>🛒 Shopping Cart</h1>
            <p className="cart-subtitle">Review your selected courses before checkout</p>

            <div className="cart-container">
                <div className="cart-items">
                    <div className="cart-header">
                        <div className="cart-count">
                            Courses in Cart
                            <span className="count-badge">{cartItems.length}</span>
                        </div>
                        {cartItems.length > 0 && (
                            <button className="clear-cart-btn" onClick={clearCart}>
                                <Trash2 size={16} />
                                Clear All
                            </button>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <div className="empty-cart-icon">
                                <ShoppingCart size={48} color="#94a3b8" />
                            </div>
                            <p>Your cart is empty. Discover amazing courses!</p>
                            <Link to="/" className="btn-keep-shopping">
                                <ShoppingBag size={20} />
                                Browse Courses
                            </Link>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="cart-item-img"
                                    onError={(e) => {
                                        e.target.src = 'https://img-c.udemycdn.com/course/480x270/placeholder.jpg';
                                    }}
                                />
                                <div className="cart-item-details">
                                    <h3>{item.title}</h3>
                                    <div className="cart-rating">
                                        <div className="rating-stars">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    size={14}
                                                    fill={star <= (item.rating || 4) ? '#fbbf24' : 'none'}
                                                    color="#fbbf24"
                                                />
                                            ))}
                                        </div>
                                        <span className="rating-num">{item.rating || 4.5}</span>
                                        <span className="rating-count">({item.totalReviews || 0} ratings)</span>
                                    </div>
                                    <div className="cart-item-category">
                                        <span className="category-badge">{item.category || 'Development'}</span>
                                    </div>
                                </div>
                                <div className="cart-item-right">
                                    <div className="cart-price">₹{item.price?.toFixed(2) || '0.00'}</div>
                                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 size={16} />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-summary">
                        <h3 className="summary-title">Order Summary</h3>

                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Discount</span>
                                <span style={{ color: discount > 0 ? '#22c55e' : '#64748b' }}>
                                    -₹{discount.toFixed(2)}
                                </span>
                            </div>
                            <div className="summary-row">
                                <span>GST (18%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="total-row">
                            <span className="total-label">Total</span>
                            <span className="total-amount">₹{total.toFixed(2)}</span>
                        </div>

                        <button
                            className="btn-checkout"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                            <ArrowRight size={20} />
                        </button>

                        <div className="coupon-section">
                            <div className="coupon-title">
                                <Tag size={16} />
                                Have a coupon?
                            </div>

                            {appliedCoupon ? (
                                <div className="applied-coupon">
                                    <div className="applied-coupon-info">
                                        <CheckCircle size={18} color="#22c55e" />
                                        <div>
                                            <div className="coupon-name">{appliedCoupon.name}</div>
                                            <div className="coupon-savings">You save ₹{discount.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="coupon-area">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                        />
                                        <button onClick={handleApplyCoupon}>Apply</button>
                                    </div>
                                    {couponError && <div className="coupon-error">{couponError}</div>}
                                    <div className="coupon-hint">Try: COURSEHUB2311 for ₹1000 off</div>
                                </>
                            )}
                        </div>

                        <div className="trust-badges">
                            <div className="trust-badge">
                                <Shield size={18} />
                                <span>Secure SSL Checkout</span>
                            </div>
                            <div className="trust-badge">
                                <Clock size={18} />
                                <span>Lifetime Access</span>
                            </div>
                            <div className="trust-badge">
                                <Award size={18} />
                                <span>Certificate of Completion</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                discount={discount}
            />
        </div>
    );
};

export default CartPage;
