import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { enrollmentService } from '../../services/enrollmentService';
import { Search, Download, Filter, X } from 'lucide-react';

const InstructorStudentsPage = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [studentFilter, setStudentFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');

    // Date range states
    const [customDateFrom, setCustomDateFrom] = useState('');
    const [customDateTo, setCustomDateTo] = useState('');

    useEffect(() => {
        if (user) {
            if (user.instructor && user.instructor.instructorId) {
                loadData(user.instructor.instructorId);
            } else if (user.id) {
                // Try to fallback or check if we can fetch it?
                // For now, let's assume if they are on this page, they should be an instructor.
                // If the context hasn't populated instructor details yet, we might wait or show a warning.
                console.warn("Instructor ID not found in user context. User might not be an instructor or context not refreshed.");
                // Attempt to use ID if it happens to match, or just don't load to avoid 404/500
                setLoading(false);
            }
        }
    }, [user]);

    const loadData = async (instructorId) => {
        try {
            const data = await enrollmentService.getInstructorEnrollments(instructorId);
            setEnrollments(data);
        } catch (error) {
            console.error("Failed to load enrollments", error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique courses from enrollments
    const uniqueCourses = Array.from(new Set(enrollments.map(item => item.courseTitle))).sort();

    // Clear all filters
    const clearAllFilters = () => {
        setStudentFilter('');
        setCourseFilter('all');
        setDateFilter('all');
        setPriceFilter('all');
        setSearchTerm('');
        setCustomDateFrom('');
        setCustomDateTo('');
    };

    // Count active filters
    const activeFiltersCount = [
        studentFilter,
        courseFilter !== 'all' ? courseFilter : '',
        dateFilter !== 'all' ? dateFilter : '',
        priceFilter !== 'all' ? priceFilter : '',
        searchTerm
    ].filter(f => f).length;

    // Filter enrollments based on all active filters
    const filteredEnrollments = enrollments.filter(item => {
        // Global search filter
        const matchesSearch = !searchTerm ||
            item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

        // Student name/email filter
        const matchesStudent = !studentFilter ||
            item.studentName.toLowerCase().includes(studentFilter.toLowerCase()) ||
            (item.studentEmail && item.studentEmail.toLowerCase().includes(studentFilter.toLowerCase()));

        // Course title filter
        const matchesCourse = courseFilter === 'all' || item.courseTitle === courseFilter;

        // Date filter
        let matchesDate = true;
        if (dateFilter !== 'all') {
            const enrolledDate = new Date(item.enrolledAt);
            const now = new Date();
            const daysDiff = Math.floor((now - enrolledDate) / (1000 * 60 * 60 * 24));

            if (dateFilter === 'custom') {
                // Custom date range
                if (customDateFrom || customDateTo) {
                    const fromDate = customDateFrom ? new Date(customDateFrom) : new Date(0);
                    const toDate = customDateTo ? new Date(customDateTo) : new Date();
                    toDate.setHours(23, 59, 59, 999); // End of day
                    matchesDate = enrolledDate >= fromDate && enrolledDate <= toDate;
                }
            } else {
                switch (dateFilter) {
                    case 'last7':
                        matchesDate = daysDiff <= 7;
                        break;
                    case 'last30':
                        matchesDate = daysDiff <= 30;
                        break;
                    case 'last90':
                        matchesDate = daysDiff <= 90;
                        break;
                    default:
                        matchesDate = true;
                }
            }
        }

        // Price filter
        let matchesPrice = true;
        if (priceFilter !== 'all') {
            const price = item.pricePaid || 0;
            switch (priceFilter) {
                case 'free':
                    matchesPrice = price === 0;
                    break;
                case 'under500':
                    matchesPrice = price > 0 && price < 500;
                    break;
                case '500to2000':
                    matchesPrice = price >= 500 && price <= 2000;
                    break;
                case 'above2000':
                    matchesPrice = price > 2000;
                    break;
                default:
                    matchesPrice = true;
            }
        }

        return matchesSearch && matchesStudent && matchesCourse && matchesDate && matchesPrice;
    });

    const totalRevenue = enrollments.reduce((sum, item) => sum + (item.pricePaid || 0), 0);

    const uniqueStudents = new Set(enrollments.map(item => item.userId)).size;

    if (loading) return <div style={{ padding: 40 }}>Loading data...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Students & Enrollments</h1>
                    <p className="dashboard-subtitle">Overview of your course sales and student progress.</p>
                </div>
                <button className="btn-admin-secondary">
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Students</div>
                    <div className="stat-value">{uniqueStudents}</div>
                    <div className="stat-trend">Lifetime Count</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
                    <div className="stat-trend">Lifetime Earnings</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Active This Month</div>
                    {/* Placeholder for real monthly logic */}
                    <div className="stat-value">{enrollments.length > 0 ? enrollments.length : 0}</div>
                    <div className="stat-trend">New Enrollments</div>
                </div>
            </div>

            {/* Data Table Section */}
            <div className="table-container">
                <div className="table-controls">
                    <div className="search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by student or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                            className="btn-admin-secondary"
                            onClick={() => setShowFilters(!showFilters)}
                            style={{
                                position: 'relative',
                                backgroundColor: showFilters ? '#3b82f6' : '',
                                color: showFilters ? 'white' : ''
                            }}
                        >
                            <Filter size={18} />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                            {activeFiltersCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        {activeFiltersCount > 0 && (
                            <button
                                className="btn-admin-secondary"
                                onClick={clearAllFilters}
                                style={{
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                <X size={18} />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Date Enrolled</th>
                                <th>Price Paid</th>
                            </tr>
                            {showFilters && (
                                <tr style={{ backgroundColor: '#f3f4f6' }}>
                                    <th style={{ padding: '12px' }}>
                                        <input
                                            type="text"
                                            placeholder="Filter by name or email..."
                                            value={studentFilter}
                                            onChange={(e) => setStudentFilter(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                        />
                                    </th>
                                    <th style={{ padding: '12px' }}>
                                        <select
                                            value={courseFilter}
                                            onChange={(e) => setCourseFilter(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                backgroundColor: 'white',
                                                cursor: 'pointer',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                        >
                                            <option value="all">All Courses</option>
                                            {uniqueCourses.map((course, idx) => (
                                                <option key={idx} value={course}>{course}</option>
                                            ))}
                                        </select>
                                    </th>
                                    <th style={{ padding: '12px' }}>
                                        <select
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                backgroundColor: 'white',
                                                cursor: 'pointer',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                        >
                                            <option value="all">All Dates</option>
                                            <option value="last7">Last 7 days</option>
                                            <option value="last30">Last 30 days</option>
                                            <option value="last90">Last 90 days</option>
                                            <option value="custom">Custom Range</option>
                                        </select>
                                        {dateFilter === 'custom' && (
                                            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <input
                                                    type="date"
                                                    placeholder="From"
                                                    value={customDateFrom}
                                                    onChange={(e) => setCustomDateFrom(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px 10px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '13px',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s',
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                />
                                                <input
                                                    type="date"
                                                    placeholder="To"
                                                    value={customDateTo}
                                                    onChange={(e) => setCustomDateTo(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px 10px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '13px',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s',
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                />
                                            </div>
                                        )}
                                    </th>
                                    <th style={{ padding: '12px' }}>
                                        <select
                                            value={priceFilter}
                                            onChange={(e) => setPriceFilter(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                backgroundColor: 'white',
                                                cursor: 'pointer',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                        >
                                            <option value="all">All Prices</option>
                                            <option value="free">Free (₹0)</option>
                                            <option value="under500">Under ₹500</option>
                                            <option value="500to2000">₹500 - ₹2000</option>
                                            <option value="above2000">Above ₹2000</option>
                                        </select>
                                    </th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {filteredEnrollments.length > 0 ? (
                                filteredEnrollments.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#1f2937' }}>{item.studentName}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item.studentEmail}</div>
                                        </td>
                                        <td>{item.courseTitle}</td>
                                        <td>{new Date(item.enrolledAt).toLocaleDateString()}</td>
                                        <td style={{ fontWeight: 600 }}>₹{item.pricePaid}</td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>No enrollments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InstructorStudentsPage;
