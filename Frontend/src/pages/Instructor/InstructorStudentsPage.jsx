import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { enrollmentService } from '../../services/enrollmentService';
import { Search, Download, Filter } from 'lucide-react';

const InstructorStudentsPage = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredEnrollments = enrollments.filter(item =>
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
