const API_URL = "http://localhost:5000/api/notes";

export const noteService = {
    getNote: async (lectureId, userId) => {
        try {
            const response = await fetch(`${API_URL}/${lectureId}/${userId}`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error("Failed to fetch note");
            }
            return await response.json();
        } catch (error) {
            console.error("Error getting note:", error);
            return null;
        }
    },

    getUserNotes: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/user/${userId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch user notes");
            }
            return await response.json();
        } catch (error) {
            console.error("Error getting user notes:", error);
            return [];
        }
    },

    saveNote: async (lectureId, userId, content) => {
        try {
            const response = await fetch(`${API_URL}?userId=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lectureId,
                    content,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to save note");
            }
            return await response.json();
        } catch (error) {
            console.error("Error saving note:", error);
            throw error;
        }
    },
};
