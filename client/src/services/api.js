import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const projectService = {
    getAllProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    }
};

export const messageService = {
    sendMessage: async (data) => {
        const response = await api.post('/messages', data);
        return response.data;
    }
};

export default api;
