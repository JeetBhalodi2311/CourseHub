const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const videoProgressService = {
    async getProgress(lectureId, userId) {
        try {
            const response = await fetch(`${API_URL}/UserVideoProgress/${lectureId}/${userId}`, {
                headers: { ...getAuthHeaders() }
            });
            if (response.status === 404) return null;
            if (!response.ok) throw new Error('Failed to fetch progress');
            return await response.json();
        } catch (error) {
            console.error('Get progress error:', error);
            return null;
        }
    },

    async saveProgress(lectureId, userId, watchedPosition) {
        try {
            const response = await fetch(`${API_URL}/UserVideoProgress?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({
                    lectureId: parseInt(lectureId),
                    watchedPosition: parseFloat(watchedPosition)
                })
            });
            if (!response.ok) throw new Error('Failed to save progress');
            return await response.json();
        } catch (error) {
            console.error('Save progress error:', error);
            throw error;
        }
    }
};
