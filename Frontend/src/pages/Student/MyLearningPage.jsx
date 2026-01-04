import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { enrollmentService } from '../../services/enrollmentService';
import { courseService } from '../../services/courseService';
import { noteService } from '../../services/noteService';
import { PlayCircle, MoreVertical, Star, Trash2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MyLearningPage.css';

const MyLearningPage = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const [activeTab, setActiveTab] = useState('all');
    const [archivedLectures, setArchivedLectures] = useState([]);
    const [userNotes, setUserNotes] = useState([]);

    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem(`archived_lectures_${user.id}`);
            if (stored) {
                setArchivedLectures(JSON.parse(stored));
            }
            // Fetch notes if tab is notes
            if (activeTab === 'notes') {
                const fetchNotes = async () => {
                    const notes = await noteService.getUserNotes(user.id);
                    setUserNotes(notes);
                };
                fetchNotes();
            }
        }
    }, [user, activeTab]); // Reload when tab changes

    useEffect(() => {
        const fetchEnrollments = async () => {
            if (!user) return;
            try {
                // Get user enrollments
                const enrollments = await enrollmentService.getUserEnrollments(user.id);
                const courseIds = enrollments.map(e => e.courseId);

                // Fetch course details
                const allCourses = await courseService.getAllCourses();
                const myCourses = allCourses.filter(c => courseIds.includes(c.id));

                setEnrolledCourses(myCourses);
            } catch (err) {
                console.error("Failed to load enrollments", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [user]);

    const displayedItems = activeTab === 'archived' ? archivedLectures : enrolledCourses;

    const handleRemoveCourse = async (courseId, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm("Are you sure you want to remove this course from your learning?")) {
            await enrollmentService.removeEnrollment(user.id, courseId);
            setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
        }
    };

    const openReviewModal = (e, courseId) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedCourseId(courseId);
        setRating(5);
        setComment('');
        setShowReviewModal(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCourseId || !user) return;
        setSubmittingReview(true);
        try {
            await courseService.createReview({
                courseId: selectedCourseId,
                userId: user.id,
                rating,
                comment
            });
            alert('Review submitted successfully!');
            setShowReviewModal(false);
        } catch (error) {
            alert('Failed to submit review.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleUnarchive = (courseId, e) => {
        e.preventDefault();
        e.stopPropagation();
        const newArchivedIds = archivedCourseIds.filter(id => id !== parseInt(courseId));
        setArchivedCourseIds(newArchivedIds);
        localStorage.setItem(`archived_courses_${user.id}`, JSON.stringify(newArchivedIds));
        alert("Course unarchived!");
    };

    if (!user) return <div style={{ padding: 40, color: '#2d2f31' }}>Please log in to view your learning.</div>;
    if (loading) return <div style={{ padding: 40, color: '#2d2f31' }}>Loading your courses...</div>;

    return (
        <div className="my-learning-page">
            <div className="my-learning-container">
                <div className="page-header">
                    <h1>My Learning</h1>
                </div>

                <div className="tabs-container">
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Courses
                    </button>

                    <button
                        className={`tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
                        onClick={() => setActiveTab('archived')}
                    >
                        Archived
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        My Notes
                    </button>
                </div>

                {activeTab === 'notes' ? (
                    <div className="notes-list-container">
                        {userNotes.length === 0 ? (
                            <div className="empty-state">
                                <h2>No notes found</h2>
                                <p style={{ color: 'var(--text-gray)' }}>You haven't taken any notes yet.</p>
                            </div>
                        ) : (
                            <div className="notes-grid">
                                {Object.values(userNotes.reduce((acc, note) => {
                                    if (!acc[note.courseId]) {
                                        acc[note.courseId] = {
                                            courseId: note.courseId,
                                            courseTitle: note.courseTitle,
                                            thumbnail: note.courseThumbnail,
                                            notes: []
                                        };
                                    }
                                    acc[note.courseId].notes.push(note);
                                    return acc;
                                }, {})).map(courseGroup => (
                                    <div key={courseGroup.courseId} className="course-notes-card">
                                        <div className="notes-course-header">
                                            {courseGroup.thumbnail && <img src={courseGroup.thumbnail} alt="" className="notes-course-thumb" />}
                                            <h3>{courseGroup.courseTitle}</h3>
                                            <span className="note-count-badge">{courseGroup.notes.length} notes</span>
                                        </div>
                                        <div className="notes-items">
                                            {courseGroup.notes.map(note => (
                                                <Link to={`/course/${note.courseId}/learn`} key={note.id} className="note-item-link">
                                                    <div className="note-item">
                                                        <div className="note-header">
                                                            <span className="note-lecture-title"><PlayCircle size={14} /> {note.lectureTitle}</span>
                                                            <span className="note-date">{new Date(note.modifiedAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="note-preview">{note.content}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    displayedItems.length === 0 ? (
                        <div className="empty-state">
                            <h2>{activeTab === 'archived' ? 'No archived lectures' : 'Start learning today'}</h2>
                            <p style={{ color: 'var(--text-gray)', marginBottom: 24 }}>
                                {activeTab === 'archived' ? 'You have not archived any lectures yet.' : "You don't have any courses yet."}
                            </p>
                            {activeTab !== 'archived' && <Link to="/" className="browse-link">Browse courses</Link>}
                        </div>
                    ) : (
                        <div className="courses-grid">
                            {displayedItems.map(item => {
                                const isLecture = activeTab === 'archived';
                                const linkTarget = isLecture ? `/course/${item.courseId}/learn` : `/course/${item.id}/learn`;
                                const title = isLecture ? item.title : item.title; // Lecture title if archived
                                const subtitle = isLecture ? item.courseTitle : item.instructorName; // Course title if archived

                                return (
                                    <Link to={linkTarget} key={item.id} className="course-card-link">
                                        <div className="learning-course-card">
                                            <div className="card-thumbnail">
                                                <img src={item.thumbnail} alt={title} />
                                                <div className="play-overlay">
                                                    <PlayCircle size={64} fill="white" color="black" />
                                                </div>
                                                {isLecture && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        left: 8,
                                                        background: 'rgba(211, 47, 47, 0.9)',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: 4,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700
                                                    }}>
                                                        ARCHIVED
                                                    </div>
                                                )}
                                            </div>
                                            <div className="card-body">
                                                <div>
                                                    <h3 className="course-title">{title}</h3>
                                                </div>

                                                <div className="card-footer">
                                                    {!isLecture && (
                                                        <div className="progress-container">
                                                            <div className="progress-bar">
                                                                <div className="progress-fill" style={{ width: '0%' }}></div>
                                                            </div>
                                                            <div className="start-text">START COURSE</div>
                                                        </div>
                                                    )}

                                                    <div className="action-row">
                                                        {!isLecture && (
                                                            <button
                                                                className="btn-rate"
                                                                onClick={(e) => openReviewModal(e, item.id)}
                                                            >
                                                                Write a Review
                                                            </button>
                                                        )}

                                                        {!isLecture && (
                                                            <button
                                                                className="btn-options"
                                                                onClick={(e) => handleRemoveCourse(item.id, e)}
                                                                title="Remove from My Learning"
                                                            >
                                                                <MoreVertical size={20} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Leave a Review</h2>
                        </div>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="form-group">
                                <label>Rating</label>
                                <select
                                    className="form-control"
                                    value={rating}
                                    onChange={e => setRating(parseInt(e.target.value))}
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                                    <option value="4">⭐⭐⭐⭐ (Good)</option>
                                    <option value="3">⭐⭐⭐ (Average)</option>
                                    <option value="2">⭐⭐ (Poor)</option>
                                    <option value="1">⭐ (Terrible)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Your Feedback</label>
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="Share your experience with this course..."
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-text" onClick={() => setShowReviewModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={submittingReview}>
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyLearningPage;
