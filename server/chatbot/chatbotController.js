const { generateChatResponse } = require('./geminiService');

const handleChat = async (req, res, next) => {
    try {
        const { message, history } = req.body;
        
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ error: 'Message content is required.' });
        }

        const reply = await generateChatResponse(message.trim(), history || []);
        res.json({ reply });
    } catch (error) {
        console.error('Error in chatbot controller:', error);
        if (error.message === 'Invalid Gemini API key.' || error.statusCode === 401) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Gemini API key.'
            });
        }
        res.status(500).json({ 
            error: 'Failed to process chat message', 
            details: error.message 
        });
    }
};

module.exports = { handleChat };
