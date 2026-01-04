import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, BarChart2, Settings, Users, PlusCircle } from 'lucide-react';
import './InstructorLayout.css';

const InstructorLayout = () => {
    return (
        <div className="instructor-layout">
            <aside className="instructor-sidebar">
                <div className="sidebar-header">
                    
                </div>
                <nav className="sidebar-nav">
                    <NavLink
                        to="/instructor"
                        end
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/instructor/categories"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <BookOpen size={20} />
                        <span>Create Categories</span>
                    </NavLink>
                    <NavLink
                        to="/instructor/create"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <PlusCircle size={20} />
                        <span>Create Course</span>
                    </NavLink>
                    
                    <NavLink
                        to="/instructor/students"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <Users size={20} />
                        <span>Students</span>
                    </NavLink>
                    <NavLink
                        to="/instructor/reviews"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <MessageSquare size={20} />
                        <span>Reviews</span>
                    </NavLink>
                    
                    <NavLink
                        to="/instructor/performance"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <BarChart2 size={20} />
                        <span>Performance</span>
                    </NavLink>

                    <div style={{ margin: '16px 24px', borderTop: '1px solid #e0e0e0' }}></div>
                    
                    <NavLink
                        to="/instructor/communication"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <MessageSquare size={20} />
                        <span>Communication</span>
                    </NavLink>
                    <NavLink
                        to="/instructor/resources"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <BookOpen size={20} />
                        <span>Resources</span>
                    </NavLink>
                    <NavLink
                        to="/instructor/settings"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                </nav>
            </aside>
            <main className="instructor-content">
                <Outlet />
            </main>
        </div>
    );
};

export default InstructorLayout;
