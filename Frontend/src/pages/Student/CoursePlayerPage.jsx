import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { noteService } from '../../services/noteService';
import { quizService } from '../../services/quizService'; // Import quizService
import { useAuth } from '../../context/AuthContext';
import { PlayCircle, Lock, ChevronLeft, Save, ClipboardList } from 'lucide-react'; // Added ClipboardList
import QuizPlayer from '../../components/Student/QuizPlayer'; // Import QuizPlayer
import './CoursePlayerPage.css';

const CoursePlayerPage = () => {
    const { courseId } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [currentQuiz, setCurrentQuiz] = useState(null); // State for active quiz
    const [curriculum, setCurriculum] = useState([]); // Combined list of lectures and quizzes
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLectureArchived, setIsLectureArchived] = useState(false);
    const [activeTab, setActiveTab] = useState('lectures'); // lectures, notes
    const [currentNote, setCurrentNote] = useState('');
    const [noteStatus, setNoteStatus] = useState('');

    useEffect(() => {
        if (user && currentLecture) {
            const stored = localStorage.getItem(`archived_lectures_${user.id}`);
            if (stored) {
                const lectures = JSON.parse(stored);
                // Check if current lecture ID exists in saved lectures
                setIsLectureArchived(lectures.some(l => l.id === currentLecture.id));
            } else {
                setIsLectureArchived(false);
            }
        }
    }, [user, currentLecture]);

    const toggleLectureArchive = () => {
        if (!user || !currentLecture) return;
        const stored = localStorage.getItem(`archived_lectures_${user.id}`);
        let lectures = stored ? JSON.parse(stored) : [];

        if (isLectureArchived) {
            lectures = lectures.filter(l => l.id !== currentLecture.id);
        } else {
            // Save essential metadata for the lecture and parent course
            lectures.push({
                id: currentLecture.id,
                title: currentLecture.title,
                duration: currentLecture.duration,
                courseId: course.id,
                courseTitle: course.title,
                thumbnail: course.thumbnail,
                instructorName: course.instructorName
            });
        }

        localStorage.setItem(`archived_lectures_${user.id}`, JSON.stringify(lectures));
        setIsLectureArchived(!isLectureArchived);
    };

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const data = await courseService.getCourseById(courseId);
                setCourse(data);

                // Fetch quizzes
                const quizzes = await quizService.getQuizzesByCourse(courseId);

                // Merge and sort
                const lecturesWithType = (data.lectures || []).map(l => ({ ...l, type: 'lecture' }));
                const quizzesWithType = (quizzes || []).map(q => ({ ...q, type: 'quiz' }));

                const mergedCurriculum = [...lecturesWithType, ...quizzesWithType].sort((a, b) => a.order - b.order);
                setCurriculum(mergedCurriculum);

                // Determine enrollment status
                let enrolled = false;
                if (user) {
                    enrolled = await enrollmentService.isEnrolled(user.id, courseId);
                }
                setIsEnrolled(enrolled);

                // Select first item
                if (mergedCurriculum.length > 0) {
                    const firstItem = mergedCurriculum[0];
                    if (firstItem.type === 'lecture') {
                        setCurrentLecture(firstItem);
                        setCurrentQuiz(null);
                    } else {
                        setCurrentQuiz(firstItem);
                        setCurrentLecture(null);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCourse();
    }, [courseId, user]);

    useEffect(() => {
        const fetchNote = async () => {
            if (user && currentLecture) {
                const note = await noteService.getNote(currentLecture.id, user.id);
                if (note) {
                    setCurrentNote(note.content);
                } else {
                    setCurrentNote('');
                }
                setNoteStatus('');
            }
        };
        fetchNote();
    }, [user, currentLecture]);

    const handleSaveNote = async () => {
        if (!user || !currentLecture) return;
        setNoteStatus('Saving...');
        try {
            await noteService.saveNote(currentLecture.id, user.id, currentNote);
            setNoteStatus('Saved!');
            setTimeout(() => setNoteStatus(''), 2000);
        } catch (error) {
            setNoteStatus('Error saving note');
        }
    };

    const handleItemClick = (item, index) => {
        if (!isEnrolled && index !== 0 && !item.isPreview) {
            alert("This content is locked. Buy the course to unlock full access.");
            return;
        }

        if (item.type === 'lecture') {
            setCurrentLecture(item);
            setCurrentQuiz(null);
        } else {
            setCurrentQuiz(item);
            setCurrentLecture(null);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!course) return <div>Course not found</div>;

    const isCurrentLocked = !isEnrolled && course.lectures.indexOf(currentLecture) !== 0 && !currentLecture?.isPreview;

    const getEmbedUrl = (url) => {
        if (!url) return '';
        // Handle youtu.be/ID
        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?modestbranding=1&rel=0`;

        // Handle youtube.com/watch?v=ID
        const watchMatch = url.match(/watch\?v=([a-zA-Z0-9_-]+)/);
        if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?modestbranding=1&rel=0`;

        // Handle youtube.com/embed/ID
        const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]+)/);
        if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}?modestbranding=1&rel=0`;

        return url; // Fallback
    };

    return (
        <div className="course-player-page">
            {/* Player Header */}
            <div className="player-header">
                <div className="player-header-left">
                    <Link to={isEnrolled ? "/my-learning" : `/course/${courseId}`} className="back-link"><ChevronLeft size={20} /> Back to {isEnrolled ? "dashboard" : "details"}</Link>
                    <h3 className="player-course-title">{course.title}</h3>
                </div>
            </div>

            <div className="player-body">
                {/* Video/Content Area */}
                <div className="player-content">
                    {currentQuiz ? (
                        <QuizPlayer
                            quizId={currentQuiz.id}
                            userId={user?.id}
                            onComplete={(result) => {
                                // Optional: mark as completed in UI or unlock next item
                                console.log("Quiz completed:", result);
                            }}
                        />
                    ) : currentLecture ? (
                        <>
                            <div className="video-viewport">
                                <div className="video-container-cinema">
                                    {!isCurrentLocked ? (
                                        currentLecture.videoUrl ? (
                                            (currentLecture.videoUrl.includes('youtube.com') || currentLecture.videoUrl.includes('youtu.be')) ? (
                                                <iframe
                                                    src={getEmbedUrl(currentLecture.videoUrl)}
                                                    title={currentLecture.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="video-iframe"
                                                />
                                            ) : (
                                                <video
                                                    key={currentLecture.id}
                                                    src={currentLecture.videoUrl}
                                                    controls
                                                    className="video-player"
                                                    onError={(e) => console.error("Video Error:", e)}
                                                />
                                            )
                                        ) : (
                                            <div className="video-placeholder">
                                                <PlayCircle size={64} color="white" />
                                                <p style={{ color: 'white', marginTop: 16 }}>No video URL for this lecture</p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="video-placeholder locked-overlay">
                                            <Lock size={64} color="white" />
                                            <h2 style={{ color: 'white', marginTop: 24 }}>This content is locked</h2>
                                            <p style={{ color: '#d1d7dc' }}>Purchase the course to unlock all content</p>
                                            <Link to={`/course/${courseId}`} className="btn-primary" style={{ marginTop: 24, padding: '12px 24px', textDecoration: 'none' }}>
                                                Buy Now
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="player-toolbar">
                                <div className="toolbar-left">
                                    <h2 className="current-lecture-title">
                                        {currentLecture.title}
                                        {isCurrentLocked && <span className="locked-badge">(LOCKED)</span>}
                                    </h2>
                                </div>
                                <div className="toolbar-right">
                                    <button
                                        onClick={toggleLectureArchive}
                                        className={`btn-action ${isLectureArchived ? 'active' : ''}`}
                                        title={isLectureArchived ? "Unarchive Lecture" : "Archive Lecture"}
                                    >
                                        <span className="icon-box">
                                            {isLectureArchived ? '★' : '☆'}
                                        </span>
                                        {isLectureArchived ? 'Archived' : 'Archive'}
                                    </button>
                                </div>
                            </div>

                            <div className="lecture-details">
                                <h3>About this lecture</h3>
                                <p>{currentLecture.contentText}</p>
                            </div>
                        </>
                    ) : (
                        <div className="no-lecture">Select an item to start</div>
                    )}
                </div>

                {/* Sidebar */}
                <div className={`player-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'lectures' ? 'active' : ''}`}
                            onClick={() => setActiveTab('lectures')}
                        >
                            Lectures
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
                            onClick={() => setActiveTab('quizzes')}
                        >
                            Quizzes
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notes')}
                        >
                            Notes
                        </button>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="close-sidebar-btn">×</button>
                    </div>

                    <div className="sidebar-content">
                        {activeTab === 'lectures' && (
                            <div className="sidebar-lectures">
                                {curriculum.filter(i => i.type === 'lecture').length > 0 ? (
                                    curriculum.filter(i => i.type === 'lecture').map((item, index) => {
                                        const isLocked = !isEnrolled && index !== 0 && !item.isPreview;
                                        const isActive = currentLecture?.id === item.id;
                                        // Original index in curriculum might be needed for logic, but here we just render list

                                        return (
                                            <div
                                                key={`lecture-${item.id}`}
                                                className={`sidebar-lecture-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                                                onClick={() => !isLocked && handleItemClick(item)}
                                            >
                                                <div className="checkbox">
                                                    {isLocked ? (
                                                        <Lock size={16} color="var(--text-light)" />
                                                    ) : (
                                                        isActive ? (
                                                            <PlayCircle size={16} fill="var(--primary-color)" color="white" />
                                                        ) : (
                                                            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--text-light)' }}></div>
                                                        )
                                                    )}
                                                </div>
                                                <div className="lecture-info-sm">
                                                    <span className="lecture-num">
                                                        {item.title}
                                                    </span>
                                                    <span className="lecture-duration">
                                                        <PlayCircle size={12} />
                                                        {item.duration > 0 ? `${Math.floor(item.duration / 60)}m ${item.duration % 60}s` : 'Video'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-light)' }}>
                                        No lectures available.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'quizzes' && (
                            <div className="sidebar-lectures">
                                {curriculum.filter(i => i.type === 'quiz').length > 0 ? (
                                    curriculum.filter(i => i.type === 'quiz').map((item) => {
                                        const isActive = currentQuiz?.id === item.id;

                                        return (
                                            <div
                                                key={`quiz-${item.id}`}
                                                className={`sidebar-lecture-item ${isActive ? 'active' : ''}`}
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <div className="checkbox">
                                                    {isActive ? (
                                                        <ClipboardList size={16} color="var(--primary-color)" />
                                                    ) : (
                                                        <ClipboardList size={16} color="var(--text-light)" />
                                                    )}
                                                </div>
                                                <div className="lecture-info-sm">
                                                    <span className="lecture-num">
                                                        {item.title}
                                                    </span>
                                                    <span className="lecture-duration">
                                                        Quiz • Pass: {item.passingScore}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-light)' }}>
                                        No quizzes available.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="sidebar-notes">
                                <div className="notes-header">
                                    <h4>Notes for: {currentLecture?.title || 'Course'}</h4>
                                    <span className="note-status">{noteStatus}</span>
                                </div>
                                <textarea
                                    className="note-textarea"
                                    value={currentNote}
                                    onChange={(e) => setCurrentNote(e.target.value)}
                                    placeholder="Type your notes here..."
                                    disabled={!currentLecture}
                                />
                                <button className="btn-primary save-note-btn" onClick={handleSaveNote} disabled={!currentLecture}>
                                    <Save size={16} /> Save Note
                                </button>
                                <div className="notes-info">
                                    <p>Notes are saved automatically per lecture.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
};

export default CoursePlayerPage;
