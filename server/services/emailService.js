const nodemailer = require('nodemailer');

// ── Transporter ────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ── Contact Form Emails ────────────────────────────────────────────────────────

/**
 * Send notification email to portfolio owner + auto-reply to visitor.
 */
const sendContactEmails = async (name, email, subject, message) => {
    const ownerMailOptions = {
        from: process.env.EMAIL_USER,
        to: 'ps213patelsanket@gmail.com',
        subject: `Portfolio Contact Form - ${subject}`,
        text: `New Portfolio Contact Request\n\nName: ${name}\n\nEmail: ${email}\n\nSubject: ${subject}\n\nMessage:\n${message}`
    };

    const visitorMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting Patel Sanket',
        text: `Hello ${name},\n\nThank you for contacting me through my portfolio website.\n\nI have received your message and will get back to you as soon as possible.\n\nBest Regards,\nPatel Sanket\nAI/ML Engineer`
    };

    try {
        await transporter.sendMail(ownerMailOptions);
        await transporter.sendMail(visitorMailOptions);
        return true;
    } catch (error) {
        console.error('Email service error:', error);
        throw new Error('Failed to send emails');
    }
};

module.exports = { sendContactEmails };
