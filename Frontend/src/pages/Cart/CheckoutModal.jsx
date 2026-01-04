import React, { useState } from 'react';
import { X, CreditCard, Lock, Smartphone, Globe, Award } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { enrollmentService } from '../../services/enrollmentService';
import { useNavigate } from 'react-router-dom';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, discount = 0 }) => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    // Calculate with discount
    const subtotal = cartTotal;
    const discountedSubtotal = subtotal - discount;
    const finalTotal = discountedSubtotal + (discountedSubtotal * 0.18);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Enroll in all courses
        try {
            for (const item of cartItems) {
                await enrollmentService.enrollUser(user.id, item.id, item.price);
            }
        } catch (err) {
            console.error("Enrollment failed", err);
        }

        setTimeout(() => {
            setProcessing(false);
            clearCart();
            onClose();
            navigate('/my-learning');
        }, 1500);
    };

    return (
        <div className="checkout-overlay">
            <div className="checkout-modal">
                {/* Header */}
                <div className="checkout-header">
                    <h2>
                        Checkout
                        <span className="header-secure-badge">
                            <Lock size={14} /> Secure
                        </span>
                    </h2>
                    <button onClick={onClose} className="btn-close"><X size={24} /></button>
                </div>

                <div className="checkout-body">
                    {/* Left Column: Input Forms */}
                    <div className="checkout-left">
                        {/* Billing Section */}
                        <div className="section-title">Billing Address</div>
                        <div className="form-group">
                            <label>Country / Region</label>
                            <select className="country-select">
                                <option>India</option>
                                <option>United States</option>
                                <option>United Kingdom</option>
                                <option>Canada</option>
                            </select>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#6a6f73', marginBottom: 32 }}>
                            CourseHub is required by law to collect applicable transaction taxes for purchases made in certain tax jurisdictions.
                        </p>

                        {/* Payment Selection */}
                        <div className="section-title">Payment Method</div>
                        <div className="payment-selector">
                            <div
                                className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <CreditCard size={24} />
                                <span>Card</span>
                            </div>
                            <div
                                className={`payment-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('upi')}
                            >
                                <Smartphone size={24} />
                                <span>UPI</span>
                            </div>
                            <div
                                className={`payment-card ${paymentMethod === 'paypal' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('paypal')}
                            >
                                <Globe size={24} />
                                <span>PayPal</span>
                            </div>
                        </div>

                        {/* Payment Form */}
                        {paymentMethod === 'card' && (
                            <form id="payment-form" onSubmit={handlePayment}>
                                <div className="form-group">
                                    <label>Name on Card</label>
                                    <input type="text" className="form-input" placeholder="Name on Card" required />
                                </div>
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="text" className="form-input" placeholder="0000 0000 0000 0000" style={{ paddingLeft: 42 }} required />
                                        <CreditCard size={20} style={{ position: 'absolute', left: 12, top: 14, color: '#9ca3af' }} />
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Expiry Date</label>
                                        <input type="text" className="form-input" placeholder="MM/YY" required />
                                    </div>
                                    <div className="form-group">
                                        <label>CVC/CVV</label>
                                        <input type="text" className="form-input" placeholder="123" required />
                                    </div>
                                </div>
                            </form>
                        )}
                        {paymentMethod === 'upi' && (
                            <div className="upi-msg">
                                <div className="form-group">
                                    <label>UPI ID</label>
                                    <input type="text" className="form-input" placeholder="example@upi" required />
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#6a6f73' }}>
                                    Open your UPI app to approve the payment request.
                                </p>
                            </div>
                        )}
                        {paymentMethod === 'paypal' && (
                            <div className="paypal-msg" style={{ background: '#f7f9fa', padding: 16, borderRadius: 8 }}>
                                <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                                    In order to complete your transaction, we will transfer you over to PayPal's secure servers.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="checkout-right">
                        <div className="section-title">Order Summary</div>

                        {/* Course List Snippet (Optional - showing top 2) */}
                        <div style={{ marginBottom: 24 }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                    <img src={item.thumbnail} alt="" style={{ width: 60, height: 34, objectFit: 'cover', borderRadius: 4 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{item.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#6a6f73' }}>₹{item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-row">
                            <span>Original Price:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="summary-row discount">
                                <span>Coupon Discount:</span>
                                <span>-₹{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row">
                            <span>GST (18%):</span>
                            <span>₹{(discountedSubtotal * 0.18).toFixed(2)}</span>
                        </div>
                        <div className="summary-line"></div>
                        <div className="total-row">
                            <span>Total:</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>

                        <button
                            className="btn-checkout-primary"
                            type="submit"
                            form={paymentMethod === 'card' ? 'payment-form' : ''}
                            onClick={paymentMethod !== 'card' ? handlePayment : undefined}
                            disabled={processing}
                        >
                            {processing ? (
                                <span>Processing...</span>
                            ) : (
                                <><span>Complete Checkout</span> <Lock size={18} /></>
                            )}
                        </button>

                        <div className="secure-note">
                            <Lock size={12} /> Secure 256-bit SSL encrypted payment
                        </div>

                        <div className="trust-badges">
                            <div className="trust-item"><Lock size={14} /> Secure</div>
                            <div className="trust-item"><Award size={14} /> Guarantee</div>
                        </div>

                        <p className="summary-note">
                            By completing your purchase you agree to these Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
