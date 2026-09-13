import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ShoppingCart, Globe, Menu, GraduationCap, Sun, Moon, Sparkles, ChevronDown, X, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const auth = useAuth();
    const { cartItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle case when auth context is not ready
    const user = auth?.user;
    const logout = auth?.logout;

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
    };

    const isInstructor = user?.role === 'Instructor' || user?.role === 'instructor';

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
                {/* Gradient Line */}
                <div className="navbar-gradient-line"></div>

                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <div className="logo-icon-wrapper">
                            <GraduationCap size={22} strokeWidth={2.5} />
                            <div className="logo-glow"></div>
                        </div>
                        <span className="logo-text">CourseHub</span>
                        <Sparkles className="logo-sparkle" size={14} />
                    </Link>

                    {/* Navigation Links */}
                    {!isInstructor && (
                        <div className="nav-links">
                            <a href="/#courses" className="nav-item">
                                <span>Courses</span>
                            </a>
                            <a href="/#customers" className="nav-item">
                                <span>Customers</span>
                            </a>
                            <a href="/#facility" className="nav-item">
                                <span>Certifications</span>
                            </a>
                            <a href="/#businessplan" className="nav-item">
                                <span>Subscription</span>
                            </a>
                            <a href="/#about" className="nav-item">
                                <span>About</span>
                            </a>
                            <a href="/#contact" className="nav-item">
                                <span>Contact</span>
                            </a>
                        </div>
                    )}

                    {/* Right Section */}
                    <div className="navbar-right">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="nav-icon-btn theme-toggle"
                            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        >
                            <div className="icon-wrapper">
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </div>
                        </button>

                        {/* Cart */}
                        {!isInstructor && (
                            <Link to="/cart" className="nav-icon-btn cart-btn">
                                <div className="icon-wrapper">
                                    <ShoppingCart size={18} />
                                </div>
                                {cartItems.length > 0 && (
                                    <span className="cart-badge">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Auth Section */}
                        {!user ? (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-login">
                                    Log in
                                </Link>
                                <Link to="/register" className="btn btn-signup">
                                    <span>Sign up</span>
                                    <Sparkles size={14} />
                                </Link>
                            </div>
                        ) : (
                            <div className="user-section">
                                {isInstructor ? (
                                    <Link to="/instructor" className="dashboard-link">
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <Link to="/my-learning" className="learning-link">
                                        <span>My Learning</span>
                                    </Link>
                                )}
                                <div className="user-profile" onClick={handleLogoutClick}>
                                    <div className="user-avatar">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <LogOut size={14} className="logout-icon" />
                                </div>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu">
                        <a href="/#courses" className="mobile-nav-item">Courses</a>
                        <a href="/#facility" className="mobile-nav-item">Facility</a>
                        <a href="/#customers" className="mobile-nav-item">Customers</a>
                        <Link to="/about" className="mobile-nav-item">About</Link>
                        <Link to="/contact" className="mobile-nav-item">Contact</Link>
                        {!user && (
                            <div className="mobile-auth">
                                <Link to="/login" className="btn btn-login">Log in</Link>
                                <Link to="/register" className="btn btn-signup">Sign up</Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="modal-overlay">
                    <div className="logout-modal">
                        <div className="modal-icon">
                            <LogOut size={32} />
                        </div>
                        <h3 className="logout-title">Log Out</h3>
                        <p className="logout-message">Are you sure you want to log out of CourseHub?</p>
                        <div className="logout-actions">
                            <button className="btn-cancel" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                            <button className="btn-confirm" onClick={confirmLogout}>
                                <LogOut size={16} />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
