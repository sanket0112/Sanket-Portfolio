const express = require('express');
const router = express.Router();
const { handleChat } = require('./chatbotController');

// POST /api/chatbot - Send a chat query to the AI assistant
router.post('/', handleChat);

module.exports = router;
