const API_URL = 'http://localhost:5000/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/Users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const user = await response.json();

            // Map backend user to frontend user/session
            // Since backend is returning raw user without token logic for now, we simulate the token again or trust the user object.
            // Backend User: Id, Name, Email, Role...
            // Frontend Context expects: user object.

            // Fix casing if needed (backend pascal, frontend usually camel, but let's check what came back).
            // Usually JSON from ASP.NET is camelCase by default in recent versions.

            const frontendUser = {
                id: (user.id || user.Id)?.toString(),
                name: user.name || user.Name,
                email: user.email || user.Email,
                role: user.role || user.Role,
                instructor: user.instructor || user.Instructor // Ensure instructor details are passed
            };

            const token = btoa(JSON.stringify(frontendUser)); // Fake token for now
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(frontendUser));

            return { user: frontendUser, token };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(name, email, password, role = 'student') {
        try {
            const response = await fetch(`${API_URL}/Users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    passwordHash: password, // Backend expects PasswordHash (based on controller Create method)
                    role
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            // Auto login after register
            return this.login(email, password);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    async updateProfile(userId, profileData) {
        try {
            const response = await fetch(`${API_URL}/Users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profileData.name,
                    email: profileData.email
                })
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = 'Failed to update profile';
                try {
                    const error = JSON.parse(text);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Update local storage with new user data
            const currentUser = this.getCurrentUser();
            const updatedUser = {
                ...currentUser,
                name: profileData.name,
                email: profileData.email
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return updatedUser;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    async changePassword(userId, currentPassword, newPassword) {
        try {
            const response = await fetch(`${API_URL}/Users/${userId}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = 'Failed to change password';
                try {
                    const error = JSON.parse(text);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            return true;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    }
};
