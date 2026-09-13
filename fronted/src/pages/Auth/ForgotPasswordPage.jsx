import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { Mail } from 'lucide-react';
import './Auth.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO: Implement actual password reset logic here
        // For now, just show success message
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitted(true);
            setError('');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError('Failed to send reset email. Please try again.');
        }
    };

    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="Enter your email and we'll send you a reset link"
        >
            {submitted ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    borderRadius: '12px',
                    border: '2px solid #22c55e'
                }}>
                    <Mail size={48} style={{ color: '#22c55e', marginBottom: '16px' }} />
                    <h3 style={{ color: '#166534', marginBottom: '8px', fontSize: '1.3rem' }}>Check Your Email</h3>
                    <p style={{ color: '#15803d', margin: 0 }}>
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p style={{ color: '#6b7280', marginTop: '16px', fontSize: '0.9rem' }}>
                        Redirecting to login page...
                    </p>
                </div>
            ) : (
                <>
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-btn">Send Reset Link</button>
                    </form>
                    <div className="auth-footer">
                        Remember your password? <Link to="/login">Back to Login</Link>
                    </div>
                </>
            )}
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
