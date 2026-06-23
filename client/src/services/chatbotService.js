import api from './api';

export const chatbotService = {
    sendChatMessage: async (message, history) => {
        const response = await api.post('/chatbot', { message, history });
        return response.data;
    }
};
