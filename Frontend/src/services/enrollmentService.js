import { authService } from './authService';

const API_URL = 'http://localhost:5000/api';

export const enrollmentService = {
    async enrollUser(userId, courseId, price) {
        try {
            // Check if already enrolled
            const isEnrolled = await this.isEnrolled(userId, courseId);
            if (isEnrolled) return null; // Or throw error

            const response = await fetch(`${API_URL}/Enrollments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    courseId: parseInt(courseId),
                    paymentStatus: 'Completed',
                    amountPaid: parseFloat(price) // Use actual price
                })
            });

            if (!response.ok) throw new Error('Enrollment failed');
            return await response.json();
        } catch (error) {
            console.error('Enrollment error:', error);
            throw error;
        }
    },

    async removeEnrollment(userId, courseId) {
        // Backend logic usually requires EnrollmentId to delete.
        // We first find the enrollment, then delete it.
        try {
            const enrollments = await this.getUserEnrollments(userId);
            const enrollment = enrollments.find(e => e.courseId.toString() === courseId.toString());

            if (!enrollment) return false;

            const response = await fetch(`${API_URL}/Enrollments/${enrollment.id}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error('Remove enrollment error:', error);
            return false;
        }
    },

    async isEnrolled(userId, courseId) {
        try {
            const enrollments = await this.getUserEnrollments(userId);
            return enrollments.some(e => e.courseId.toString() === courseId.toString());
        } catch (error) {
            return false;
        }
    },

    async getUserEnrollments(userId) {
        try {
            const response = await fetch(`${API_URL}/Enrollments/user/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch enrollments');
            const data = await response.json();

            // Map backend to frontend expectations
            return data.map(e => ({
                id: e.id.toString(),
                userId: e.userId.toString(),
                courseId: e.courseId.toString(),
                enrolledAt: e.enrolledAt,
                progress: 0, // Backend doesn't store progress yet, default to 0
                course: e.course ? {
                    ...e.course,
                    thumbnail: 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg', // Fallback
                    instructorName: e.course.instructor?.name || 'Instructor'
                } : null
            }));
        } catch (error) {
            console.error('Get user enrollments error:', error);
            return [];
        }
    },

    async getInstructorEnrollments(instructorId) {
        try {
            const response = await fetch(`${API_URL}/Enrollments/instructor/${instructorId}`);
            if (!response.ok) throw new Error('Failed to fetch instructor enrollments');
            const data = await response.json();

            return data.map(e => {
                // Handle casing differences (Pascal vs Camel)
                const user = e.user || e.User;
                const course = e.course || e.Course;

                return {
                    id: (e.id || e.Id)?.toString(),
                    userId: (e.userId || e.UserId)?.toString(),
                    courseId: (e.courseId || e.CourseId)?.toString(),
                    enrolledAt: e.enrolledAt || e.EnrolledAt,
                    pricePaid: e.amountPaid || e.AmountPaid,
                    studentName: user ? (user.name || user.Name) : 'Unknown Student',
                    studentEmail: user ? (user.email || user.Email) : 'No Email',
                    courseTitle: course ? (course.title || course.Title) : 'Unknown Course',
                    paymentStatus: e.paymentStatus || e.PaymentStatus
                };
            });
        } catch (error) {
            console.error('Get instructor enrollments error:', error);
            return [];
        }
    }
};
