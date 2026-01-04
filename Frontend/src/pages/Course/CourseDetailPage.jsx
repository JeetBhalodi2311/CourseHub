import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Star, PlayCircle, Globe, Award, Check } from 'lucide-react';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [previewLecture, setPreviewLecture] = useState(null);

    // Helper for YouTube Embeds (Same as Player Page)
    const getEmbedUrl = (url) => {
        if (!url) return '';
        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&modestbranding=1&rel=0`;
        const watchMatch = url.match(/watch\?v=([a-zA-Z0-9_-]+)/);
        if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&modestbranding=1&rel=0`;
        const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]+)/);
        if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}?autoplay=1&modestbranding=1&rel=0`;
        return url;
    };

    const handlePreview = (lecture) => {
        if (lecture.isPreview) {
            setPreviewLecture(lecture);
        }
    };

    const closePreview = () => {
        setPreviewLecture(null);
    };

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const data = await courseService.getCourseById(courseId);
                setCourse(data);
                if (user) {
                    const enrolled = await enrollmentService.isEnrolled(user.id, courseId);
                    setIsEnrolled(enrolled);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCourse();
    }, [courseId, user]);

    const handleAddToCart = () => {
        addToCart(course);
        navigate('/cart');
    };

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        await enrollmentService.enrollUser(user.id, courseId);
        setIsEnrolled(true);
        navigate('/my-learning');
    };

    const goToCourse = () => {
        navigate(`/course/${courseId}/learn`);
    };

    if (loading) return <div>Loading...</div>;
    if (!course) return <div>Course not found</div>;

    return (
        <div className="course-detail-page">
            {/* Preview Modal */}
            {previewLecture && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }} onClick={closePreview}>
                    <div style={{
                        width: '80%', maxWidth: 800, background: '#000', borderRadius: 8, overflow: 'hidden', position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                            {previewLecture.videoUrl && (previewLecture.videoUrl.includes('youtube') || previewLecture.videoUrl.includes('youtu.be')) ? (
                                <iframe
                                    src={getEmbedUrl(previewLecture.videoUrl)}
                                    title={previewLecture.title}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    src={previewLecture.videoUrl}
                                    controls
                                    autoPlay
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                />
                            )}
                        </div>
                        <div style={{ padding: 16, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Free Preview: {previewLecture.title}</h3>
                            <button onClick={closePreview} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>×</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Hero */}
            <div className="course-header-container">
                {/* ... (Keep existing Header content) ... */}
                <div className="course-header-content">
                    <div className="course-breadcrumb">
                        Development {'>'} {course.category} {'>'} {course.title}
                    </div>
                    <h1 className="course-title-lg">{course.title}</h1>
                    <p className="course-subtitle">{course.description}</p>

                    <div className="course-badge-row">
                        <span className="bestseller-badge">Bestseller</span>
                        <span className="rating-num">{course.rating}</span>
                        <div className="stars-row">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < Math.floor(course.rating) ? "#e59819" : "none"} color="#e59819" />
                            ))}
                        </div>
                        <span className="rating-count">({course.totalReviews} ratings)</span>
                        <span className="student-count">12,345 students</span>
                    </div>

                    <div className="creator-row">
                        Created by <a href="#">{course.instructorName}</a>
                    </div>

                    <div className="meta-row">
                        <div className="meta-item"><Globe size={16} /> English</div>
                    </div>
                </div>
            </div>

            <div className="course-body-container">
                <div className="course-main-content">
                    {/* What you'll learn */}
                    <div className="what-you-learn-box">
                        <h3>What you'll learn</h3>
                        <ul className="learning-list">
                            <li><Check size={16} /> Become an expert in {course.category}</li>
                            <li><Check size={16} /> Build real-world projects</li>
                            <li><Check size={16} /> Master the fundamentals of {course.title}</li>
                            <li><Check size={16} /> Earn a certificate of completion</li>
                        </ul>
                    </div>

                    {/* Curriculum */}
                    <div className="curriculum-section">
                        <h3>Course content</h3>
                        <div className="lectures-list">
                            {course.lectures && course.lectures.length > 0 ? (
                                course.lectures.map((lecture, index) => {
                                    const isPreviewable = index === 0 || lecture.isPreview;
                                    return (
                                        <div
                                            key={lecture.id}
                                            className="lecture-item"
                                            onClick={() => isPreviewable && handlePreview(lecture)}
                                            style={{
                                                cursor: isPreviewable ? 'pointer' : 'default',
                                                backgroundColor: '#fff',
                                                border: '1px solid #d1d7dc',
                                                padding: '12px 16px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderBottom: 'none',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => { if (isPreviewable) e.currentTarget.style.backgroundColor = '#f7f9fa'; }}
                                            onMouseLeave={(e) => { if (isPreviewable) e.currentTarget.style.backgroundColor = '#fff'; }}
                                        >
                                            <div className="lecture-info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                {isPreviewable ? (
                                                    <PlayCircle size={16} color="#a435f0" fill="#a435f0" style={{ opacity: 0.2 }} />
                                                ) : (
                                                    <div style={{ width: 16 }} />
                                                )}
                                                <span style={{ color: isPreviewable ? '#5624d0' : '#2d2f31', textDecoration: isPreviewable ? 'underline' : 'none' }}>
                                                    {lecture.title}
                                                </span>
                                            </div>
                                            <div className="lecture-meta" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                {isPreviewable ? (
                                                    <span style={{ color: '#5624d0', fontWeight: 700, fontSize: '0.9rem' }}>Preview</span>
                                                ) : (
                                                    <span style={{ fontSize: '0.8rem', color: '#6a6f73' }}>Locked</span>
                                                )}
                                                <span style={{ minWidth: 40, textAlign: 'right', color: '#6a6f73' }}>
                                                    {lecture.duration > 0 ? `${Math.floor(lecture.duration / 60)}:${String(lecture.duration % 60).padStart(2, '0')}` : ''}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ padding: 16, color: '#6a6f73', fontStyle: 'italic' }}>
                                    No lectures added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="course-sidebar">
                    <div className="sidebar-card">
                        <div className="sidebar-preview-img" onClick={() => course.lectures?.find(l => l.isPreview) && handlePreview(course.lectures.find(l => l.isPreview))} style={{ cursor: 'pointer' }}>
                            <img src={course.thumbnail} alt="preview" />
                            <div className="play-overlay"><PlayCircle size={48} fill="white" color="black" /></div>
                            <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', color: 'white', fontWeight: 'bold', textShadow: '0 1px 2px black' }}>Preview this course</div>
                        </div>
                        <div className="sidebar-content">
                            <div className="price-large">₹{course.price}</div>

                            {isEnrolled ? (
                                <button className="btn-primary-lg" onClick={goToCourse}>Go to Course</button>
                            ) : (
                                <>
                                    <button className="btn-primary-lg" onClick={handleAddToCart}>Add to cart</button>
                                    <button className="btn-secondary-lg" onClick={handleEnroll}>Buy now</button>
                                </>
                            )}
                            {/* ... Rest of sidebar ... */}
                            <div className="guarantee">30-Day Money-Back Guarantee</div>

                            <div className="includes-list">
                                <h4>This course includes:</h4>
                                <ul>
                                    <li><PlayCircle size={16} /> 14 hours on-demand video</li>
                                    <li><Award size={16} /> Certificate of completion</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
