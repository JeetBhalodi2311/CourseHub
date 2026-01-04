const API_URL = "http://localhost:5000/api/quizzes";

export const quizService = {
    getQuizzesByCourse: async (courseId) => {
        try {
            const response = await fetch(`${API_URL}/course/${courseId}`);
            if (!response.ok) throw new Error("Failed to fetch quizzes");
            return await response.json();
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            return [];
        }
    },

    getQuiz: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error("Failed to fetch quiz details");
            return await response.json();
        } catch (error) {
            console.error("Error fetching quiz:", error);
            return null;
        }
    },

    submitQuiz: async (id, userId, answers) => {
        // answers: [{ questionId, selectedOptionId }]
        try {
            const response = await fetch(`${API_URL}/${id}/submit?userId=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ answers }),
            });
            if (!response.ok) throw new Error("Failed to submit quiz");
            return await response.json();
        } catch (error) {
            console.error("Error submitting quiz:", error);
            throw error;
        }
    },

    createQuiz: async (quizData) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(quizData),
            });
            if (!response.ok) throw new Error("Failed to create quiz");
            return await response.json();
        } catch (error) {
            console.error("Error creating quiz:", error);
            throw error;
        }
    },

    deleteQuiz: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete quiz");
            return true;
        } catch (error) {
            console.error("Error deleting quiz:", error);
            throw error;
        }
    }
};
