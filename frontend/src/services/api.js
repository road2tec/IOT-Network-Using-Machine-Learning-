import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        return api.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me')
};

export const predictionService = {
    predictFeatures: (features) => api.post('/predict/', { features }),
    uploadCSV: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/predict/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getHistory: () => api.get('/predict/history')
};

export const adminService = {
    getStats: () => api.get('/admin/dashboard-stats'),
    getUsers: () => api.get('/admin/users'),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
};

export default api;
