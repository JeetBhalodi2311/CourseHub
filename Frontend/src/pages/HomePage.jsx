import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { courseService } from '../services/courseService';
import CourseCard from '../components/course/CourseCard';
import HeroSection from '../components/home/HeroSection';
import TrustedCompanies from '../components/home/TrustedCompanies';
import Testimonials from '../components/home/Testimonials';
import Certifications from '../components/home/Certifications';
import BusinessPlans from '../components/home/BusinessPlans';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';
import './HomePage.css';

const HomePage = () => {
    // State for dynamic data
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    // Load data from API
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Fetch Courses
                const coursesData = await courseService.getAllCourses();
                setCourses(coursesData);

                // Fetch Categories
                const catsData = await courseService.getCategories();
                // Map to simple array of names for the filter buttons, ensuring 'All' is first
                const catNames = ['All', ...catsData.map(c => c.categoryName)];
                // Remove duplicates + distinct
                const uniqueCats = [...new Set(catNames)];
                setCategories(uniqueCats);

            } catch (error) {
                console.error("Failed to load home data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // Filter logic
    const filteredCourses = selectedCategory === 'All'
        ? courses
        : courses.filter(course => course.category === selectedCategory);

    if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="home-page">
            {/* Hero Section - Original UI */}
            {/* Hero Section - New Professional Component */}
            <HeroSection />

            {/* Trusted Companies */}
            <TrustedCompanies />

            {/* Courses Section */}
            <section id="courses" className="courses-section">
                <h2>Students are viewing</h2>

                {/* Category Filter - Using Original Classes but Dynamic Data */}
                <div className="category-filter">
                    {categories.map((cat, index) => (
                        <button
                            key={index}
                            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="course-grid">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <div className="no-courses-message">
                            <p>No courses found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials */}
            <div id="customers">
                <Testimonials />
            </div>

            {/* Certifications Banner */}
            <div id="facility">
                <Certifications />
            </div>

            {/* Business/Plans */}
            <div id="businessplan">
                <BusinessPlans />
            </div>

            {/* About Section */}
            <div id="about">
                <AboutSection />
            </div>

            {/* Contact Section */}
            <div id="contact">
                <ContactSection />
            </div>
        </div>
    );
};

export default HomePage;
