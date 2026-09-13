import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { quizService } from '../../services/quizService'; // Import quizService
import { Save, Plus, Trash2, GripVertical, PlayCircle, Edit2, X, ClipboardList } from 'lucide-react'; // Added ClipboardList
import QuizForm from '../../components/Instructor/QuizForm'; // Import QuizForm
import './CreateCoursePage.css';

const EditCoursePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('landing'); // 'landing' or 'curriculum'
    const [loading, setLoading] = useState(true);

    // Course Data State
    const [course, setCourse] = useState(null);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(''); // Changed to ID
    const [categories, setCategories] = useState([]); // Dynamic categories
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState('');

    // Curriculum State
    const [lectures, setLectures] = useState([]);
    const [quizzes, setQuizzes] = useState([]); // State for quizzes
    const [isAddingLecture, setIsAddingLecture] = useState(false);
    const [isAddingQuiz, setIsAddingQuiz] = useState(false); // State for adding quiz
    const [editingLecture, setEditingLecture] = useState(null); // id of lecture being edited

    // Temp Lecture State
    const [lectureForm, setLectureForm] = useState({ title: '', videoUrl: '', duration: 0, isPreview: false });

    useEffect(() => {
        loadData();
    }, [courseId]);

    const loadData = async () => {
        try {
            // Load Categories first
            const cats = await courseService.getCategories();
            setCategories(cats);

            // Load Course
            const data = await courseService.getCourseById(courseId);
            setCourse(data);
            setTitle(data.title);
            setSubtitle(data.description || ''); // Mapping description to subtitle place if needed, or separate? Backend has Description. Frontend has subtitle state?
            // Actually backend only has Description. Let's use Description for both if needed or remove subtitle. 
            // The previous code had subtitle state but backend 'getCourseById' mapped description.
            // Let's stick to Title, Description, Price, Thumbnail, Category.

            setDescription(data.description || '');
            setPrice(data.price);
            setThumbnail(data.thumbnail);

            // Find category ID by matching name if possible, or use data.categoryId if available.
            // value in select should be ID.
            // getCourseById returns 'category': 'Name'. It assumes we only have name.
            // We need to match name to ID from categories list.
            if (data.category && cats.length > 0) {
                const foundCat = cats.find(c => c.categoryName === data.category);
                if (foundCat) setCategoryId(foundCat.categoryId);
            }

            // Load lectures
            if (data.lectures) {
                setLectures(data.lectures);
            }

            // Load quizzes
            const quizData = await quizService.getQuizzesByCourse(courseId);
            setQuizzes(quizData || []);
        } catch (err) {
            console.error(err);
            alert("Failed to load course");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGeneral = async (e) => {
        e.preventDefault();
        try {
            if (!course) return;

            await courseService.updateCourse(courseId, {
                title,
                description,
                price: Number(price),
                thumbnail,
                categoryId: categoryId, // Send ID
                instructorId: course.instructorId // Persist original instructor
            });
            alert("Course settings saved!");
        } catch (err) {
            console.error(err);
            alert("Failed to save changes.");
        }
    };

    const handleAddLecture = async (e) => {
        e.preventDefault();
        try {
            const nextOrder = lectures.length > 0 ? Math.max(...lectures.map(l => l.order)) + 1 : 1;
            await courseService.addLecture(courseId, {
                title: lectureForm.title,
                videoUrl: lectureForm.videoUrl,
                description: '', // Optional content text
                order: nextOrder,
                isPreview: lectureForm.isPreview
            });
            // Refresh list
            const updatedLectures = await courseService.getLectures(courseId);
            setLectures(updatedLectures);

            setIsAddingLecture(false);
            setLectureForm({ title: '', videoUrl: '', duration: 0, isPreview: false });
        } catch (err) {
            console.error(err);
            alert("Failed to add lecture");
        }
    };

    const startEditLecture = (lecture) => {
        setEditingLecture(lecture.id);
        setLectureForm({
            title: lecture.title,
            videoUrl: lecture.videoUrl,
            duration: lecture.duration,
            isPreview: lecture.isPreview
        });
    };

    const handleUpdateLecture = async (e) => {
        e.preventDefault();
        try {
            // Find current lecture order to preserve it
            const current = lectures.find(l => l.id === editingLecture);
            await courseService.updateLecture(editingLecture, {
                courseId: courseId,
                title: lectureForm.title,
                videoUrl: lectureForm.videoUrl,
                order: current ? current.order : 1,
                isPreview: lectureForm.isPreview
            });

            const updatedLectures = await courseService.getLectures(courseId);
            setLectures(updatedLectures);

            setEditingLecture(null);
            setLectureForm({ title: '', videoUrl: '', duration: 0, isPreview: false });
        } catch (err) {
            console.error(err);
            alert("Failed to update lecture");
        }
    };

    const handleDeleteLecture = async (id) => {
        if (!window.confirm("Delete this lecture?")) return;
        try {
            await courseService.deleteLecture(id);
            setLectures(lectures.filter(l => l.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete lecture");
        }
    };

    const handleSaveQuiz = async (quizData) => {
        try {
            // Determine order: max of lectures and quizzes
            const allItems = [...lectures, ...quizzes];
            const nextOrder = allItems.length > 0 ? Math.max(...allItems.map(i => i.order)) + 1 : 1;

            await quizService.createQuiz({
                courseId: Number(courseId),
                title: quizData.title,
                passingScore: quizData.passingScore,
                order: nextOrder,
                questions: quizData.questions
            });

            // Refresh quizzes
            const updatedQuizzes = await quizService.getQuizzesByCourse(courseId);
            setQuizzes(updatedQuizzes);
            setIsAddingQuiz(false);
        } catch (err) {
            console.error(err);
            alert("Failed to create quiz");
        }
    };

    const handleDeleteQuiz = async (id) => {
        if (!window.confirm("Delete this quiz?")) return;
        try {
            await quizService.deleteQuiz(id);
            setQuizzes(quizzes.filter(q => q.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete quiz");
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading course data...</div>;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Edit Course</h1>
                    <p className="dashboard-subtitle">{title}</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate('/instructor')} className="btn-admin-secondary">
                        Back to Dashboard
                    </button>
                    <button className="btn-admin-secondary" onClick={() => window.open(`/course/${courseId}`, '_blank')}>
                        <PlayCircle size={16} /> Preview
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid #e5e7eb', marginBottom: 32 }}>
                <button
                    onClick={() => setActiveTab('landing')}
                    style={{
                        padding: '12px 4px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'landing' ? '2px solid #4f46e5' : '2px solid transparent',
                        fontWeight: activeTab === 'landing' ? 700 : 500,
                        cursor: 'pointer',
                        color: activeTab === 'landing' ? '#4f46e5' : '#6b7280',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                    }}
                >
                    Course Landing Page
                </button>
                <button
                    onClick={() => setActiveTab('curriculum')}
                    style={{
                        padding: '12px 4px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'curriculum' ? '2px solid #4f46e5' : '2px solid transparent',
                        fontWeight: activeTab === 'curriculum' ? 700 : 500,
                        cursor: 'pointer',
                        color: activeTab === 'curriculum' ? '#4f46e5' : '#6b7280',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                    }}
                >
                    Curriculum
                </button>
            </div>

            {/* General Settings Tab */}
            {activeTab === 'landing' && (
                <div className="admin-card">
                    <form onSubmit={handleSaveGeneral}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="admin-label">Course Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="admin-input"
                                    required
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="admin-label">Description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="admin-textarea"
                                    style={{ height: 160 }}
                                />
                            </div>

                            <div>
                                <label className="admin-label">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={e => setCategoryId(e.target.value)}
                                    className="admin-select"
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="admin-label">Price (₹)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    className="admin-input"
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="admin-label">Thumbnail URL</label>
                                <input
                                    type="text"
                                    value={thumbnail}
                                    onChange={e => setThumbnail(e.target.value)}
                                    className="admin-input"
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 24, textAlign: 'right', borderTop: '1px solid #f3f4f6', paddingTop: 24 }}>
                            <button type="submit" className="btn-admin-primary">
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h3 style={{ margin: 0 }}>Course Content</h3>
                        {!isAddingLecture && !isAddingQuiz && !editingLecture && (
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => setIsAddingQuiz(true)} className="btn-admin-secondary" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <ClipboardList size={18} /> Add Quiz
                                </button>
                                <button onClick={() => setIsAddingLecture(true)} className="btn-admin-primary" style={{ fontSize: '0.9rem' }}>
                                    <Plus size={18} /> Add Lecture
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Add/Edit Form */}
                    {isAddingQuiz && (
                        <QuizForm
                            onSave={handleSaveQuiz}
                            onCancel={() => setIsAddingQuiz(false)}
                        />
                    )}

                    {(isAddingLecture || editingLecture) && (
                        <div style={{ background: '#f9f9f9', border: '1px solid #ebedf3', borderRadius: 8, padding: 24, marginBottom: 24 }}>
                            <h4 style={{ marginTop: 0, marginBottom: 16 }}>{editingLecture ? 'Edit Lecture' : 'New Lecture'}</h4>
                            <form onSubmit={editingLecture ? handleUpdateLecture : handleAddLecture}>
                                <div style={{ marginBottom: 16 }}>
                                    <label className="admin-label">Title</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={lectureForm.title}
                                        onChange={e => setLectureForm({ ...lectureForm, title: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label className="admin-label">Video URL (mp4 link)</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={lectureForm.videoUrl}
                                        onChange={e => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                                        required
                                        placeholder="https://..."
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="admin-label">Duration (sec)</label>
                                        <input
                                            type="number"
                                            className="admin-input"
                                            value={lectureForm.duration}
                                            onChange={e => setLectureForm({ ...lectureForm, duration: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: 10 }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, color: '#3f4254' }}>
                                            <input
                                                type="checkbox"
                                                checked={lectureForm.isPreview}
                                                onChange={e => setLectureForm({ ...lectureForm, isPreview: e.target.checked })}
                                                style={{ width: 18, height: 18 }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>Enable Free Preview</span>
                                        </label>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button type="button" onClick={() => { setIsAddingLecture(false); setEditingLecture(null); }} className="btn-admin-secondary">Cancel</button>
                                    <button type="submit" className="btn-admin-primary">{editingLecture ? 'Update Lecture' : 'Add Lecture'}</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Content List */}
                    <div className="lecture-list" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {lectures.length === 0 && quizzes.length === 0 && !isAddingLecture && !isAddingQuiz && (
                            <div style={{ textAlign: 'center', padding: 40, background: '#f9f9f9', borderRadius: 8, color: '#a1a5b7' }}>
                                Start by adding your first lecture or quiz.
                            </div>
                        )}
                        {[...lectures.map(l => ({ ...l, type: 'lecture' })), ...quizzes.map(q => ({ ...q, type: 'quiz' }))]
                            .sort((a, b) => a.order - b.order)
                            .map(item => (
                                <div key={`${item.type}-${item.id}`} style={{
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    padding: '16px 20px', background: '#fff', border: '1px solid #ebedf3', borderRadius: 8,
                                    opacity: (editingLecture === item.id) ? 0.5 : 1, transition: 'all 0.2s'
                                }}>
                                    <GripVertical size={20} color="#a1a5b7" style={{ cursor: 'move' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#3f4254' }}>
                                            {item.type === 'lecture' ?
                                                <PlayCircle size={16} color="#a435f0" /> :
                                                <ClipboardList size={16} color="#a435f0" />
                                            }
                                            {item.type === 'lecture' ? 'Lecture' : 'Quiz'} {item.order}: {item.title}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#a1a5b7', marginTop: 4 }}>
                                            {item.type === 'lecture' ? (
                                                <>
                                                    {item.isPreview ? <span style={{ color: '#0ca678', fontWeight: 600 }}>Preview Enabled</span> : 'Content Locked'} • {Math.floor(item.duration / 60)} mins
                                                </>
                                            ) : (
                                                <>
                                                    Pass Score: {item.passingScore}% • {item.questions?.length || 0} Questions
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {item.type === 'lecture' ? (
                                            <button
                                                onClick={() => startEditLecture(item)}
                                                className="action-btn"
                                                disabled={!!editingLecture}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        ) : null}
                                        <button
                                            onClick={() => item.type === 'lecture' ? handleDeleteLecture(item.id) : handleDeleteQuiz(item.id)}
                                            className="action-btn"
                                            disabled={!!editingLecture}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditCoursePage;
