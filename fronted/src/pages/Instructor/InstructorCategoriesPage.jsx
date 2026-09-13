import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { PlusCircle, Trash2, Search, X, FolderPlus, Edit } from 'lucide-react';
import './InstructorDashboard.css';
import './CategoryModal.css';

const InstructorCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        const data = await courseService.getCategories();
        setCategories(data);
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        setSubmitting(true);
        try {
            if (isEditing) {
                await courseService.updateCategory(editingId, { name: formData.name });
            } else {
                await courseService.createCategory({ name: formData.name });
            }
            closeModal();
            await loadCategories();
        } catch (error) {
            alert(isEditing ? 'Failed to update category' : 'Failed to create category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (category) => {
        setIsEditing(true);
        setEditingId(category.categoryId);
        setFormData({ name: category.categoryName });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await courseService.deleteCategory(id);
            setCategories(categories.filter(c => c.categoryId !== id));
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    const closeModal = () => {
        setShowForm(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '' });
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '' });
        setShowForm(true);
    };

    const filteredCategories = categories.filter(c =>
        c.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Categories Management</h1>
                    <p className="dashboard-subtitle">Manage course categories for the platform.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn-admin-primary"
                >
                    <PlusCircle size={20} /> Add Category
                </button>
            </div>

            {/* Modal Overlay */}
            {showForm && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-icon">
                                {isEditing ? <Edit size={28} /> : <FolderPlus size={28} />}
                            </div>
                            <h2>{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
                            <p>{isEditing ? 'Update the category name.' : 'Create a new category for organizing courses.'}</p>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="modal-form">
                            <div className="form-group">
                                <label className="admin-label">Category Name *</label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    placeholder="e.g., Data Science, Web Development"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-modal-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-modal-primary" disabled={submitting}>
                                    {submitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Category' : 'Create Category')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="table-controls">
                <div className="search-box">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: 80 }}>ID</th>
                            <th>Category Name</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: 40 }}>Loading categories...</td></tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: 40 }}>No categories found.</td></tr>
                        ) : (
                            filteredCategories.map(cat => (
                                <tr key={cat.categoryId}>
                                    <td style={{ color: '#666' }}>#{cat.categoryId}</td>
                                    <td style={{ fontWeight: 600, fontSize: '1rem' }}>{cat.categoryName}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="action-btn"
                                            title="Edit Category"
                                            style={{ color: '#6366f1' }}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.categoryId)}
                                            className="action-btn"
                                            title="Delete Category"
                                            style={{ color: '#dc3545' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InstructorCategoriesPage;
