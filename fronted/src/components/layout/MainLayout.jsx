import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { Outlet } from 'react-router-dom';
import AIChatbot from '../student/AIChatbot';

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
            <AIChatbot />
        </div>
    );
};

export default MainLayout;
