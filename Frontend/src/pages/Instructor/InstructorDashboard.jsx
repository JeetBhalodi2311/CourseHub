import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { PlusCircle, Trash2, Edit, Search, BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ totalStudents: 0, totalRevenue: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [categories, setCategories] = useState([]); // Dynamic categories

    useEffect(() => {
        const loadDashboardData = async () => {
            if (user?.role === 'Instructor' || user?.role === 'instructor') {
                const instructorId = user.instructor ? user.instructor.instructorId : parseInt(user.id);

                // Load All Courses
                const allCourses = await courseService.getAllCourses();
                setCourses(allCourses);

                // Load Categories
                const catData = await courseService.getCategories();
                setCategories(catData);

                // Load Enrollments for Stats
                const enrollments = await enrollmentService.getInstructorEnrollments(instructorId);
                const revenue = enrollments.reduce((sum, e) => sum + (e.pricePaid || 0), 0);

                // Calculate unique students
                const uniqueStudents = new Set(enrollments.map(e => e.userId)).size;

                setStats({
                    totalStudents: uniqueStudents, // Use unique count
                    totalRevenue: revenue,
                    recentEnrollments: enrollments // Store full list for table
                });
            }
        };
        loadDashboardData();
    }, [user]);

    const handleCreateClick = () => {
        navigate('/instructor/create');
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            const success = await courseService.deleteCourse(courseId);
            if (success) {
                setCourses(courses.filter(c => c.id !== courseId));
            }
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Instructor Dashboard</h1>
                    <p className="dashboard-subtitle">Manage courses and view performance.</p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="btn-admin-primary"
                >
                    <PlusCircle size={20} /> New Course
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label"><BookOpen size={16} /> Total Courses (All)</div>
                    <div className="stat-value">{courses.length}</div>
                    <div className="stat-trend"><TrendingUp size={14} /> Active in DB</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label"><Users size={16} /> Total Students</div>
                    <div className="stat-value">{stats.totalStudents.toLocaleString()}</div>
                    <div className="stat-trend"><TrendingUp size={14} /> Unique Operations</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label"><DollarSign size={16} /> Total Revenue</div>
                    <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                    <div className="stat-trend"><TrendingUp size={14} /> Earnings</div>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <div className="table-controls">
                    <div className="search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search your courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <select
                            className="filter-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryName}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="table-container">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>All Courses (Global)</h3>
                    <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Rating</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#6a6f73' }}>No courses found.</td>
                                    </tr>
                                ) : (
                                    filteredCourses.map(course => (
                                        <tr key={course.id}>
                                            <td>
                                                <div className="course-cell">
                                                    <img src={course.thumbnail} alt="" className="course-thumb" />
                                                    <div className="course-info">
                                                        <div className="course-title">{course.title}</div>
                                                        <div className="course-meta">{course.lectures ? course.lectures.length : 0} Lectures</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{course.category}</td>
                                            <td style={{ fontWeight: 600 }}>₹{course.price}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <span style={{ color: '#b4690e', fontWeight: 700 }}>{course.rating}</span>
                                                    <span style={{ color: '#d1d7dc' }}>★</span>
                                                </div>
                                            </td>
                                            <td><span className="status-badge status-active">Active</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                    <Link to={`/instructor/edit/${course.id}`} className="action-btn" title="Edit">
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button onClick={() => handleDelete(course.id)} className="action-btn" title="Delete">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Students Table */}
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>Recent Student Enrollments</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Course Enrolled</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentEnrollments && stats.recentEnrollments.length > 0 ? (
                                    stats.recentEnrollments.slice(-5).reverse().map(student => (
                                        <tr key={student.id}>
                                            <td style={{ fontWeight: 500 }}>{student.studentName}</td>
                                            <td style={{ color: '#666' }}>{student.studentEmail}</td>
                                            <td>{student.courseTitle}</td>
                                            <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
                                            <td style={{ fontWeight: 600, color: '#28a745' }}>₹{student.pricePaid}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#6a6f73' }}>No student enrollments yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
