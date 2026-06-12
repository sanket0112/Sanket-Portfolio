const Message = require('../models/Message');
const Analytics = require('../models/Analytics');
const { validationResult } = require('express-validator');
const { sendContactEmails } = require('../services/emailService');

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res, next) => {
    try {
        // 1. Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0].msg);
        }

        const { name, email, message, subject } = req.body;

        // 2. Send Emails via Nodemailer
        await sendContactEmails(name, email, subject, message);

        // 3. Save to Database
        const newMessage = await Message.create({
            name,
            email,
            subject,
            message
        });

        // 4. Track analytics
        let analytics = await Analytics.findOne();
        if (analytics) {
            analytics.contactRequests += 1;
            await analytics.save();
        }

        res.status(201).json({ success: true, data: newMessage, message: 'Message sent successfully! I will get back to you soon.' });
    } catch (error) {
        // If email fails
        if (error.message === 'Failed to send emails') {
            res.status(500);
            return next(new Error('Failed to send message. Please try again later.'));
        }
        next(error);
    }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin)
const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
const deleteMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            res.status(404);
            throw new Error('Message not found');
        }

        await message.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendMessage,
    getMessages,
    deleteMessage
};
