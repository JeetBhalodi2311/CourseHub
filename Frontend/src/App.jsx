import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import CourseDetailPage from './pages/Course/CourseDetailPage';
import MyLearningPage from './pages/Student/MyLearningPage';
import CoursePlayerPage from './pages/Student/CoursePlayerPage';
import InstructorLayout from './components/layout/InstructorLayout';
import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import InstructorStudentsPage from './pages/Instructor/InstructorStudentsPage';
import InstructorCommunicationPage from './pages/Instructor/InstructorCommunicationPage';
import InstructorPerformancePage from './pages/Instructor/InstructorPerformancePage';
import InstructorSettingsPage from './pages/Instructor/InstructorSettingsPage';
import InstructorCategoriesPage from './pages/Instructor/InstructorCategoriesPage';
import CreateCoursePage from './pages/Instructor/CreateCoursePage';
import EditCoursePage from './pages/Instructor/EditCoursePage';
import InstructorResourcesPage from './pages/Instructor/InstructorResourcesPage';
import InstructorReviewsPage from './pages/Instructor/InstructorReviewsPage';
import CartPage from './pages/Cart/CartPage';
import AboutPage from './pages/Common/AboutPage';
import ContactPage from './pages/Common/ContactPage';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <DataProvider>
                    <CartProvider>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<HomePage />} />
                                <Route path="course/:courseId" element={<CourseDetailPage />} />
                                <Route path="cart" element={<CartPage />} />
                                <Route path="my-learning" element={<MyLearningPage />} />

                                {/* Instructor Routes Nested Layout */}
                                <Route path="instructor" element={<InstructorLayout />}>
                                    <Route index element={<InstructorDashboard />} />
                                    <Route path="create" element={<CreateCoursePage />} />
                                    <Route path="edit/:courseId" element={<EditCoursePage />} />
                                    <Route path="students" element={<InstructorStudentsPage />} />
                                    <Route path="communication" element={<InstructorCommunicationPage />} />
                                    <Route path="performance" element={<InstructorPerformancePage />} />
                                    <Route path="categories" element={<InstructorCategoriesPage />} />
                                    <Route path="settings" element={<InstructorSettingsPage />} />
                                    <Route path="resources" element={<InstructorResourcesPage />} />
                                    <Route path="reviews" element={<InstructorReviewsPage />} />
                                </Route>

                                <Route path="about" element={<AboutPage />} />
                                <Route path="contact" element={<ContactPage />} />
                            </Route>

                            <Route path="/course/:courseId/learn" element={<CoursePlayerPage />} />
                        </Routes>
                    </CartProvider>
                </DataProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
