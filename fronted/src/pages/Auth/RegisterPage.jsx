import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('Student');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await register(name, email, password, role);
            if (user.role === 'Instructor' || user.role === 'instructor') {
                navigate('/instructor');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start your learning journey today"
        >
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Full name"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email address"
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
                            placeholder="Password"
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
                <div className="form-group">
                    <select
                        className="form-input"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="Student">I am a Student</option>
                        <option value="Instructor">I am an Instructor</option>
                    </select>
                </div>
                <button type="submit" className="auth-btn">Sign Up</button>
            </form>
            <div className="auth-footer">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
