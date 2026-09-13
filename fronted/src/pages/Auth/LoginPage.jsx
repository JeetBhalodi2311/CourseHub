import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'Instructor' || user.role === 'instructor') {
                navigate('/instructor');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Please enter your details to sign in."
        >
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
                <div className="form-group">
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <div className="forgot-password-wrapper">
                    <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
                </div>
                <button type="submit" className="auth-btn">Sign in</button>
            </form>
            <div className="auth-footer">
                Don't have an account? <Link to="/register">Sign up for free</Link>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
