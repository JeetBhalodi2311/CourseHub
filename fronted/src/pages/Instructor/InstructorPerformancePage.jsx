import React, { useState, useEffect, useMemo } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Legend } from 'recharts';
import { DollarSign, Users, TrendingUp, BookOpen, Star, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import './InstructorPerformancePage.css';

const InstructorPerformancePage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [timeFilter, setTimeFilter] = useState('all');

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Logic matching InstructorDashboard for ID resolution
            const instructorId = user.instructor ? user.instructor.instructorId : parseInt(user.id);

            const [realCourses, realEnrollments, allReviews] = await Promise.all([
                courseService.getInstructorCourses(instructorId),
                enrollmentService.getInstructorEnrollments(instructorId),
                courseService.getAllReviews()
            ]);

            // Set Real Data Only
            setCourses(realCourses || []);
            setEnrollments(realEnrollments || []);

            // Filter reviews for this instructor
            const instructorReviews = allReviews.filter(r =>
                r.instructorId?.toString() === instructorId?.toString() ||
                r.instructorId?.toString() === user.id?.toString()
            );
            setReviews(instructorReviews || []);

        } catch (error) {
            console.error('Error fetching performance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        let filteredEnrollments = enrollments;
        let filteredReviews = reviews;

        if (timeFilter === 'month') {
            filteredEnrollments = enrollments.filter(e => {
                const d = new Date(e.enrolledAt);
                return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
            });
            filteredReviews = reviews.filter(r => {
                const d = new Date(r.createdAt);
                return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
            });
        } else if (timeFilter === 'week') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredEnrollments = enrollments.filter(e => new Date(e.enrolledAt) >= oneWeekAgo);
            filteredReviews = reviews.filter(r => new Date(r.createdAt) >= oneWeekAgo);
        } else if (timeFilter === 'year') {
            filteredEnrollments = enrollments.filter(e => new Date(e.enrolledAt).getFullYear() === currentYear);
            filteredReviews = reviews.filter(r => new Date(r.createdAt).getFullYear() === currentYear);
        }

        const totalRevenue = filteredEnrollments.reduce((sum, e) => sum + (parseFloat(e.pricePaid) || 0), 0);

        // Use userId for uniqueness if available, fallback to studentName
        const uniqueStudents = new Set(filteredEnrollments.map(e => e.userId || e.studentName)).size;

        const avgRating = filteredReviews.length > 0
            ? filteredReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / filteredReviews.length
            : 0;

        return {
            totalRevenue,
            totalEnrollments: uniqueStudents,
            averageRating: avgRating.toFixed(1),
            activeCourses: courses.length,
            reviewCount: filteredReviews.length
        };
    }, [enrollments, reviews, courses.length, timeFilter]);

    const getCombinedChartData = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        let dataMap = [];

        if (timeFilter === 'week') {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dataMap = days.map(d => ({ name: d, revenue: 0, students: 0 }));
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            enrollments.forEach(e => {
                const d = new Date(e.enrolledAt);
                if (d >= oneWeekAgo) {
                    const dayIndex = d.getDay();
                    if (dataMap[dayIndex]) {
                        dataMap[dayIndex].revenue += parseFloat(e.pricePaid) || 0;
                        dataMap[dayIndex].students += 1;
                    }
                }
            });
        } else {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            dataMap = months.map(m => ({ name: m, revenue: 0, students: 0 }));

            enrollments.forEach(e => {
                const d = new Date(e.enrolledAt);
                if (d.getFullYear() === currentYear) {
                    const monthIndex = d.getMonth();
                    if (dataMap[monthIndex]) {
                        dataMap[monthIndex].revenue += parseFloat(e.pricePaid) || 0;
                        dataMap[monthIndex].students += 1;
                    }
                }
            });
        }
        return dataMap;
    };

    const getCoursePerformance = () => {
        return courses.map(course => {
            const courseEnrollments = enrollments.filter(e => e.courseId?.toString() === course.id?.toString());
            const courseReviews = reviews.filter(r => r.courseId?.toString() === course.id?.toString());

            const revenue = courseEnrollments.reduce((sum, e) => sum + (parseFloat(e.pricePaid) || 0), 0);
            const avgRating = courseReviews.length > 0
                ? courseReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / courseReviews.length
                : 0;

            return {
                ...course,
                enrollmentCount: courseEnrollments.length,
                revenue,
                avgRating: avgRating.toFixed(1),
                reviewCount: courseReviews.length
            };
        }).sort((a, b) => b.revenue - a.revenue);
    };

    const coursePerformance = getCoursePerformance();
    const topPerformers = coursePerformance.slice(0, 3);
    const combinedChartData = getCombinedChartData();

    if (loading) {
        return (
            <div className="performance-dashboard">
                <div className="performance-loading">
                    <div className="performance-spinner"></div>
                    <p>Loading your performance data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="performance-dashboard">
            <div className="performance-header">
                <div>
                    <h1>Performance Analytics</h1>
                    <p className="subtitle">Track your revenue and student growth with real-time data.</p>
                </div>
                <div className="time-filter">
                    <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                        <option value="all">All Time</option>
                        <option value="year">This Year</option>
                        <option value="month">This Month</option>
                        <option value="week">This Week</option>
                    </select>
                </div>
            </div>

            <div className="performance-stats-grid">
                <div className="performance-stat-card revenue">
                    <div className="stat-card-header">
                        <div className="stat-card-info">
                            <p>Total Revenue</p>
                            <h3>₹{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="stat-icon green"><DollarSign size={26} /></div>
                    </div>
                </div>
                <div className="performance-stat-card enrollments">
                    <div className="stat-card-header">
                        <div className="stat-card-info">
                            <p>Total Students</p>
                            <h3>{stats.totalEnrollments.toLocaleString()}</h3>
                        </div>
                        <div className="stat-icon blue"><Users size={26} /></div>
                    </div>
                </div>
                <div className="performance-stat-card courses">
                    <div className="stat-card-header">
                        <div className="stat-card-info">
                            <p>Total Courses</p>
                            <h3>{stats.activeCourses}</h3>
                        </div>
                        <div className="stat-icon purple"><BookOpen size={26} /></div>
                    </div>
                </div>
            </div>

            <div className="performance-charts-row">
                <div className="performance-chart-card full-width">
                    <div className="chart-header">
                        <h3><TrendingUp size={20} /> Revenue vs Students</h3>
                    </div>
                    {/* Inline Height Style to fix Recharts width(-1) error */}
                    <div className="chart-container large" style={{ height: '400px', width: '100%', minHeight: '400px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={combinedChartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} formatter={(value, name) => [name === 'Revenue' ? `₹${value.toLocaleString()}` : value, name]} />
                                <Legend />
                                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" fill="url(#colorRevenue)" />
                                <Bar yAxisId="right" dataKey="students" name="Students" fill="#0ea5e9" barSize={30} radius={[4, 4, 0, 0]} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {topPerformers.length > 0 && (
                <div className="top-performers-section">
                    {topPerformers.map(course => (
                        <div key={course.id} className="top-performer-card">
                            <h4>{course.title}</h4>
                            <div className="top-performer-stats">
                                <div className="top-stat"><strong>₹{course.revenue.toLocaleString()}</strong> Revenue</div>
                                <div className="top-stat"><strong>{course.enrollmentCount}</strong> Students</div>
                                <div className="top-stat"><strong>⭐ {course.avgRating}</strong> Rating</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="performance-table-section">
                <div className="table-header">
                    <h3>Course Performance</h3>
                </div>
                {coursePerformance.length > 0 ? (
                    <table className="performance-table">
                        <thead>
                            <tr><th>Course</th><th>Enrollments</th><th>Revenue</th><th>Rating</th></tr>
                        </thead>
                        <tbody>
                            {coursePerformance.map(course => (
                                <tr key={course.id}>
                                    <td>
                                        <div className="course-cell">
                                            {course.thumbnail && <img src={course.thumbnail} alt="" className="course-thumbnail" />}
                                            <div className="course-details"><h4>{course.title}</h4><span>{course.category}</span></div>
                                        </div>
                                    </td>
                                    <td className="metric-cell">{course.enrollmentCount}</td>
                                    <td className="metric-cell revenue">₹{course.revenue.toLocaleString()}</td>
                                    <td>
                                        <div className="rating-cell"><Star size={16} fill="#f59e0b" stroke="#f59e0b" /> {course.avgRating}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="performance-empty">
                        <h3>No Courses Yet</h3>
                        <p>Detailed performance metrics will appear here once you have courses and students.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorPerformancePage;
