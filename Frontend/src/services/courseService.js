const API_URL = 'http://localhost:5000/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
    async getInstructorCourses(instructorId) {
        try {
            const response = await fetch(`${API_URL}/Courses/instructor/${instructorId}`);
            if (!response.ok) throw new Error('Failed to fetch instructor courses');
            const data = await response.json();

            // Map data
            return data.map(course => ({
                id: course.id.toString(),
                title: course.title,
                description: course.description,
                price: course.price,
                rating: course.averageRating || 0,
                totalReviews: 0,
                thumbnail: course.imageUrl || 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg', // Use ImageUrl from backend
                category: course.category?.name || 'Uncategorized',
                categoryImage: course.category?.imageUrl || '', // New field
                instructorId: course.instructorId.toString(),
                instructorName: course.instructor?.name || 'Unknown Instructor',
                lectures: course.lectures || course.Lectures || []
            }));
        } catch (error) {
            console.error('Error fetching instructor courses:', error);
            return [];
        }
    },

    async getAllCourses() {
        try {
            const response = await fetch(`${API_URL}/Courses`);
            if (!response.ok) throw new Error('Failed to fetch courses');
            const data = await response.json();

            // Map backend data to frontend model
            return data.map(course => ({
                id: course.id.toString(), // Frontend expects string IDs
                title: course.title,
                description: course.description,
                price: course.price,
                rating: course.averageRating || 0, // Map averageRating -> rating
                totalReviews: 0, // Not in backend Course model yet
                thumbnail: course.imageUrl || 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg', // Use ImageUrl
                // Handle various casing for Category object or null
                category: course.category?.categoryName || course.Category?.CategoryName || course.category?.name || 'Uncategorized',
                categoryImage: course.category?.imageUrl || '',
                instructorId: course.instructorId.toString(),
                instructorName: course.instructor?.name || 'Unknown Instructor', // Handle Instructor object
                lectures: course.lectures || course.Lectures || []
            }));
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    },

    async getCourseById(id) {
        try {
            const response = await fetch(`${API_URL}/Courses/${id}`);
            if (!response.ok) throw new Error('Course not found');
            const course = await response.json();

            // Fetch lectures for this course if not included in course response
            // Backend GetAll/GetById includes lectures? Course model has ICollection<Lecture> but Controller might not include it deeply or it ignores loops.
            // Let's assume we might need to fetch them or they are in valid JSON.
            // But for now, let's map the course.

            return {
                id: course.id.toString(),
                title: course.title,
                description: course.description,
                price: course.price,
                rating: course.averageRating || 0,
                totalReviews: 0,
                thumbnail: course.imageUrl || 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg',
                category: course.category?.name || 'Uncategorized',
                categoryImage: course.category?.imageUrl || '',
                instructorId: course.instructorId.toString(),
                instructorName: course.instructor?.name || 'Unknown Instructor',
                lectures: (course.lectures || []).map(l => ({
                    id: l.id.toString(),
                    title: l.title,
                    videoUrl: l.videoUrl || '', // Backend Lecture has VideoUrl? Check model.
                    duration: l.duration || 0,
                    isPreview: l.isPreview || false,
                    order: l.order || 0
                })).sort((a, b) => a.order - b.order)
            };
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw error;
        }
    },

    async createCourse(courseData) {
        try {
            const response = await fetch(`${API_URL}/Courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: courseData.title,
                    description: courseData.description,
                    price: parseFloat(courseData.price),
                    imageUrl: courseData.imageUrl, // Fixed: use imageUrl property
                    categoryId: parseInt(courseData.categoryId),
                    instructorId: parseInt(courseData.instructorId)
                })
            });
            if (!response.ok) throw new Error('Failed to create course');
            const data = await response.json();

            // Notify app of update
            window.dispatchEvent(new Event('coursesUpdated'));

            return data;
        } catch (error) {
            console.error('Create course error:', error);
            throw error;
        }
    },

    async updateCourse(id, updates) {
        try {
            const response = await fetch(`${API_URL}/Courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: updates.title,
                    description: updates.description,
                    price: parseFloat(updates.price),
                    imageUrl: updates.thumbnail, // Map thumbnail to ImageUrl
                    categoryId: parseInt(updates.categoryId),
                    instructorId: parseInt(updates.instructorId)
                })
            });
            if (!response.ok) throw new Error('Failed to update course');
            return await response.json();
        } catch (error) {
            console.error('Update course error:', error);
            throw error;
        }
    },

    async deleteCourse(id) {
        try {
            const response = await fetch(`${API_URL}/Courses/${id}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error('Error deleting course:', error);
            return false;
        }
    },

    // Lecture Methods
    async getLectures(courseId) {
        try {
            const response = await fetch(`${API_URL}/Lectures/course/${courseId}`);
            if (!response.ok) throw new Error('Failed to fetch lectures');
            const data = await response.json();
            return data.map(l => ({
                id: l.id.toString(),
                title: l.title,
                videoUrl: l.videoUrl || '',
                duration: l.duration || 0, // Backend might not have duration calc, we'll assume manual input or 0
                isPreview: l.isPreview || false,
                order: l.order || 0
            }));
        } catch (error) {
            console.error('Error fetching lectures:', error);
            return [];
        }
    },

    async addLecture(courseId, lectureData) {
        try {
            const response = await fetch(`${API_URL}/Lectures`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: parseInt(courseId),
                    title: lectureData.title,
                    videoUrl: lectureData.videoUrl,
                    contentText: lectureData.description || '', // Mapping description to ContentText
                    order: lectureData.order || 0,
                    isPreview: lectureData.isPreview || false
                })
            });
            if (!response.ok) throw new Error('Failed to add lecture');
            return await response.json();
        } catch (error) {
            console.error('Add lecture error:', error);
            throw error;
        }
    },

    async updateLecture(lectureId, updates) {
        try {
            const response = await fetch(`${API_URL}/Lectures/${lectureId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: parseInt(updates.courseId),
                    title: updates.title,
                    videoUrl: updates.videoUrl,
                    contentText: updates.description || '',
                    order: updates.order || 0,
                    isPreview: updates.isPreview || false
                })
            });
            if (!response.ok) throw new Error('Failed to update lecture');
            return await response.json();
        } catch (error) {
            console.error('Update lecture error:', error);
            throw error;
        }
    },

    async deleteLecture(lectureId) {
        try {
            const response = await fetch(`${API_URL}/Lectures/${lectureId}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error('Delete lecture error:', error);
            return false;
        }
    },

    async getCategories() {
        try {
            const response = await fetch(`${API_URL}/Categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            // Normalize casing
            return data.map(c => ({
                categoryId: c.categoryId || c.CategoryId,
                categoryName: c.categoryName || c.CategoryName,
                imageUrl: c.imageUrl || c.ImageUrl
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    async createCategory(categoryData) {
        try {
            const response = await fetch(`${API_URL}/Categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    CategoryName: categoryData.name,
                    ImageUrl: categoryData.imageUrl || ''
                })
            });
            if (!response.ok) throw new Error('Failed to create category');
            return await response.json();
        } catch (error) {
            console.error('Create category error:', error);
            throw error;
        }
    },

    async deleteCategory(id) {
        try {
            const response = await fetch(`${API_URL}/Categories/${id}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error('Delete category error:', error);
            return false;
        }
    },

    async updateCategory(id, categoryData) {
        try {
            const response = await fetch(`${API_URL}/Categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    CategoryName: categoryData.name
                })
            });
            if (!response.ok) throw new Error('Failed to update category');
            return await response.json();
        } catch (error) {
            console.error('Update category error:', error);
            throw error;
        }
    },

    async createReview(reviewData) {
        try {
            const response = await fetch(`${API_URL}/Reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: parseInt(reviewData.courseId),
                    userId: parseInt(reviewData.userId),
                    rating: parseInt(reviewData.rating),
                    comment: reviewData.comment
                })
            });
            if (!response.ok) throw new Error('Failed to create review');
            return await response.json();
        } catch (error) {
            console.error('Create review error:', error);
            throw error;
        }
    },

    async getAllReviews() {
        try {
            const response = await fetch(`${API_URL}/Reviews`);
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            return data.map(r => {
                const course = r.course || r.Course;
                const user = r.user || r.User;
                return {
                    id: r.id || r.Id,
                    rating: r.rating || r.Rating,
                    comment: r.comment || r.Comment,
                    createdAt: r.createdAt || r.CreatedAt,
                    // Map nested objects if they exist (backend must include them)
                    courseId: r.courseId || r.CourseId,
                    courseTitle: course?.title || course?.Title || 'Unknown Course',
                    courseThumbnail: course?.imageUrl || course?.ImageUrl || '',
                    studentName: user?.name || user?.Name || 'Anonymous',
                    instructorId: course?.instructorId || course?.InstructorId // Important for filtering
                };
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    }
};
