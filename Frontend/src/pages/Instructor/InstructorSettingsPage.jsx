import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import './InstructorDashboard.css';

const InstructorSettingsPage = () => {
    const { user, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile State
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        headline: '',
        bio: ''
    });

    // Password State
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                headline: user.headline || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleSaveProfile = async () => {
        if (!profile.name.trim() || !profile.email.trim()) {
            showMessage('error', 'Name and email are required');
            return;
        }

        setSaving(true);
        try {
            const updatedUser = await authService.updateProfile(user.id, {
                name: profile.name,
                email: profile.email
            });

            // Update context
            if (setUser) {
                setUser(updatedUser);
            }

            showMessage('success', 'Profile updated successfully!');
        } catch (error) {
            showMessage('error', error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            showMessage('error', 'All password fields are required');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            showMessage('error', 'New passwords do not match');
            return;
        }

        if (passwords.new.length < 6) {
            showMessage('error', 'New password must be at least 6 characters');
            return;
        }

        setSaving(true);
        try {
            await authService.changePassword(user.id, passwords.current, passwords.new);
            setPasswords({ current: '', new: '', confirm: '' });
            showMessage('success', 'Password changed successfully!');
        } catch (error) {
            showMessage('error', error.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Settings</h1>
                    <p className="dashboard-subtitle">Manage your profile and account preferences</p>
                </div>
            </div>

            {/* Message Toast */}
            {message.text && (
                <div style={{
                    padding: '14px 20px',
                    borderRadius: 12,
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: message.type === 'success' ? '#065f46' : '#dc2626',
                    fontWeight: 500
                }}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                {/* Settings Sidebar */}
                <div className="admin-card" style={{ width: 240, padding: 0, overflow: 'hidden' }}>
                    <div className="settings-nav">
                        <button
                            onClick={() => setActiveTab('profile')}
                            style={{
                                width: '100%', textAlign: 'left', padding: '16px 20px',
                                background: activeTab === 'profile' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                border: 'none', borderLeft: activeTab === 'profile' ? '4px solid #6366f1' : '4px solid transparent',
                                display: 'flex', alignItems: 'center', gap: 12,
                                fontWeight: 600, color: activeTab === 'profile' ? '#6366f1' : 'var(--text-light)',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <User size={18} /> Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            style={{
                                width: '100%', textAlign: 'left', padding: '16px 20px',
                                background: activeTab === 'security' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                border: 'none', borderLeft: activeTab === 'security' ? '4px solid #6366f1' : '4px solid transparent',
                                display: 'flex', alignItems: 'center', gap: 12,
                                fontWeight: 600, color: activeTab === 'security' ? '#6366f1' : 'var(--text-light)',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <Lock size={18} /> Security
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            style={{
                                width: '100%', textAlign: 'left', padding: '16px 20px',
                                background: activeTab === 'notifications' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                border: 'none', borderLeft: activeTab === 'notifications' ? '4px solid #6366f1' : '4px solid transparent',
                                display: 'flex', alignItems: 'center', gap: 12,
                                fontWeight: 600, color: activeTab === 'notifications' ? '#6366f1' : 'var(--text-light)',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <Bell size={18} /> Notifications
                        </button>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="admin-card" style={{ flex: 1 }}>
                    {activeTab === 'profile' && (
                        <div>
                            <h3 style={{ marginTop: 0, marginBottom: 24, fontWeight: 700 }}>Profile Information</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="admin-input"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', borderTop: '1px solid var(--border-color)', paddingTop: 24 }}>
                                <button
                                    className="btn-admin-primary"
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                                >
                                    <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div>
                            <h3 style={{ marginTop: 0, marginBottom: 24, fontWeight: 700 }}>Change Password</h3>

                            <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label className="admin-label">Current Password</label>
                                    <input
                                        type="password"
                                        className="admin-input"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div>
                                    <label className="admin-label">New Password</label>
                                    <input
                                        type="password"
                                        className="admin-input"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div>
                                    <label className="admin-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="admin-input"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24, marginTop: 24 }}>
                                <button
                                    className="btn-admin-primary"
                                    onClick={handleChangePassword}
                                    disabled={saving}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                                >
                                    <Lock size={18} /> {saving ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div>
                            <h3 style={{ marginTop: 0, marginBottom: 24, fontWeight: 700 }}>Notification Preferences</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--heading-color)' }}>Email Notifications</div>
                                        <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Receive emails about new enrollments</div>
                                    </div>
                                    <input type="checkbox" defaultChecked style={{ width: 20, height: 20, accentColor: '#6366f1' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--heading-color)' }}>Student Messages</div>
                                        <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Receive emails when a student messages you</div>
                                    </div>
                                    <input type="checkbox" defaultChecked style={{ width: 20, height: 20, accentColor: '#6366f1' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--heading-color)' }}>Course Updates</div>
                                        <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Receive updates about your course performance</div>
                                    </div>
                                    <input type="checkbox" defaultChecked style={{ width: 20, height: 20, accentColor: '#6366f1' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorSettingsPage;
