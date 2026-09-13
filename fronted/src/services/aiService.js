const API_URL = 'http://localhost:5000/api/AI'; // Updated to match launchSettings.json port

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const chatApi = {
    async sendMessage(message, context = null, history = []) {
        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ message, context, history }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                // Throwing an object with response property to match component error handling
                const error = new Error(errorData || 'Failed to get AI response');
                error.response = {
                    status: response.status,
                    data: { response: errorData }
                };
                throw error;
            }

            const data = await response.json();
            // Return structure matching component expectation: response.data.response
            return {
                data: {
                    response: data.reply
                }
            };
        } catch (error) {
            console.error('AI Service Error:', error);
            throw error;
        }
    }
};
