import React, { createContext, useContext, useState, useEffect } from 'react';
import { courseService } from '../services/courseService';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCourses = async () => {
        try {
            const data = await courseService.getAllCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();

        const handleUpdate = () => {
            loadCourses();
        };

        window.addEventListener('coursesUpdated', handleUpdate);
        return () => window.removeEventListener('coursesUpdated', handleUpdate);
    }, []);

    return (
        <DataContext.Provider value={{ courses, loadCourses, loading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
