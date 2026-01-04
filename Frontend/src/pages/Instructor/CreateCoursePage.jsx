import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import './CreateCoursePage.css';

const CreateCoursePage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]); // Store fetched categories
    const [categoryId, setCategoryId] = useState(''); // Store selected ID
    const [price, setPrice] = useState('19.99');
    const [thumbnail, setThumbnail] = useState('https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg');

    const [loading, setLoading] = useState(false);
    const [fetchingCategories, setFetchingCategories] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            console.log("Fetching categories...");
            if (!courseService.getCategories) {
                setError("Service Error: courseService.getCategories is undefined.");
                setFetchingCategories(false);
                return;
            }
            try {
                const data = await courseService.getCategories();
                console.log("Categories fetched:", data);
                if (Array.isArray(data) && data.length > 0) {
                    setCategories(data);
                    setCategoryId(data[0].categoryId); // Default to first category
                } else if (!Array.isArray(data)) {
                    setError("Invalid Data: Categories response is not an array.");
                    setCategories([]);
                } else {
                    // Empty array
                    setCategories([]);
                }
            } catch (err) {
                console.error("Error in fetchCategories:", err);
                setError("Failed to load categories. Please check your internet connection or backend server.");
            } finally {
                setFetchingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!user) {
            alert("You must be logged in to create a course.");
            setLoading(false);
            return;
        }

        if (!title.trim()) {
            alert("Please enter a course title.");
            setLoading(false);
            return;
        }

        if (!categoryId) {
            alert("Please select a valid category.");
            setLoading(false);
            return;
        }

        if (parseFloat(price) < 0) {
            alert("Price cannot be negative.");
            setLoading(false);
            return;
        }

        // Determine instructor ID safer way
        let instructorId = 0;
        if (user.instructor && user.instructor.instructorId) {
            instructorId = user.instructor.instructorId;
        } else if (user.id) {
            // Fallback if user is instructor but maybe structure is different
            // This assumes the user ID might be the instructor ID or we have to handle this mismatch
            instructorId = parseInt(user.id);
        }

        if (instructorId === 0) {
            alert("Could not determine Instructor ID. Please try logging out and back in.");
            setLoading(false);
            return;
        }

        console.log("Creating course with:", { title, categoryId, price, thumbnail, instructorId });

        try {
            const newCourse = await courseService.createCourse({
                title,
                categoryId: parseInt(categoryId), // Use selected ID directly
                description: description,
                price: parseFloat(price),
                imageUrl: thumbnail,
                instructorId: instructorId
            });
            console.log("Course created:", newCourse);
            alert("Course created successfully!");
            navigate('/instructor'); // Redirect to Dashboard instead of Edit
        } catch (err) {
            console.error("Failed to create course:", err);
            alert("Failed to create course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingCategories) {
        return <div className="create-course-container"><div className="create-course-box"><p>Loading categories...</p></div></div>;
    }

    return (
        <div className="create-course-container">
            <div className="create-course-box">
                <h1>Name your course</h1>
                <p>What would you like to name your course? Don't worry, you can change this later.</p>

                {error && (
                    <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {categories.length === 0 && !error && (
                    <div style={{ padding: '12px', background: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                        <strong>Warning:</strong> No categories found. Please run backend migrations to seed data.
                    </div>
                )}

                <form onSubmit={handleCreate}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-label">Course Title</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Master React in 30 Days"
                                required
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-label">Description</label>
                            <textarea
                                className="admin-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Course description..."
                            />
                        </div>

                        <div>
                            <label className="admin-label">Category</label>
                            <select
                                className="admin-select"
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                disabled={categories.length === 0}
                            >
                                {categories.length === 0 ? (
                                    <option value="" disabled>
                                        {error ? "Error loading categories" : "No categories found"}
                                    </option>
                                ) : (
                                    categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryName}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="admin-label">Price (₹)</label>
                            <input
                                type="number"
                                className="admin-input"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-label">Thumbnail URL</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={thumbnail}
                                onChange={e => setThumbnail(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-admin-secondary" onClick={() => navigate('/instructor')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-admin-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCoursePage;
