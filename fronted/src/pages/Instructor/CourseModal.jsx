import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CourseModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('499');
    const [category, setCategory] = useState('Development');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title);
            setPrice(initialData.price);
            setCategory(initialData.category || 'Development');
            setDescription(initialData.description || '');
        } else {
            // Reset for new course
            setTitle('');
            setPrice('499');
            setCategory('Development');
            setDescription('');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Clean price input
        const numericPrice = parseFloat(price);

        await onSave({
            title,
            price: isNaN(numericPrice) ? 0 : numericPrice,
            category,
            description
        });
        setLoading(false);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
        }}>
            <div style={{
                background: 'white', padding: 24, borderRadius: 8, width: 500, maxWidth: '95vw',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                        {initialData ? 'Edit Course Details' : 'Create New Course'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Course Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g. Complete Python Bootcamp"
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #2d2f31', borderRadius: 0 }}
                        />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #2d2f31', borderRadius: 0 }}
                        >
                            <option>Development</option>
                            <option>Business</option>
                            <option>Finance & Accounting</option>
                            <option>IT & Software</option>
                            <option>Office Productivity</option>
                            <option>Personal Development</option>
                            <option>Design</option>
                            <option>Marketing</option>
                            <option>Health & Fitness</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Price (₹)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #2d2f31', borderRadius: 0 }}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Description (Brief)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #2d2f31', borderRadius: 0, resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '12px 24px', background: 'transparent', border: 'none', color: '#2d2f31', fontWeight: 700, cursor: 'pointer'
                        }}>Cancel</button>
                        <button type="submit" disabled={loading} style={{
                            padding: '12px 24px', background: '#2d2f31', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer'
                        }}>
                            {loading ? 'Saving...' : 'Save Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseModal;
