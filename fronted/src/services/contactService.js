const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const contactService = {
    async sendMessage(contactData) {
        try {
            const response = await fetch(`${API_URL}/Contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(contactData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server Error Details:', errorData);
                throw new Error(errorData.error || errorData.message || 'Failed to send message');
            }

            return await response.json();
        } catch (error) {
            console.error('Contact service error:', error);
            throw error;
        }
    },

    async getMessages() {
        try {
            const response = await fetch(`${API_URL}/Contact`, {
                headers: { ...getAuthHeaders() }
            });
            if (!response.ok) throw new Error('Failed to fetch messages');
            return await response.json();
        } catch (error) {
            console.error('Get messages error:', error);
            return [];
        }
    }
};
