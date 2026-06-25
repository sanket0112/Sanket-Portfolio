require('dotenv').config();

// ── Environment Verification ──────────────────────────────────────────────────
const requiredEnvVars = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'CRITICAL CONFIGURATION ERROR: Missing required environment variables:');
    missingEnvVars.forEach(envVar => console.error('\x1b[31m%s\x1b[0m', ` - ${envVar}`));
    console.error('\x1b[33m%s\x1b[0m', 'Please check your server/.env configuration and restart.');
    process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// ── Connect to Database (deferred until server startup) ──────────────────────────

const app = express();

// ── Security: HTTP Headers ─────────────────────────────────────────────────────
app.use(helmet());

// ── CORS Configuration ─────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://sanket-portfolio.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. Postman, mobile apps) in development
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// ── Body Parsing ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));      // Prevent huge payload attacks
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ── Data Sanitization ──────────────────────────────────────────────────────────
app.use(mongoSanitize());  // Prevent MongoDB operator injection ($where, $gt, etc.)
app.use(xss());            // Strip XSS from request body, query, params

// ── Global Rate Limiter ────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,                  // Max 200 requests per window per IP
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', globalLimiter);

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/users',     require('./routes/userRoutes'));
app.use('/api/projects',  require('./routes/projectRoutes'));
app.use('/api/messages',  require('./routes/messageRoutes'));
app.use('/api/admin',     require('./routes/adminRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/resume',    require('./routes/resumeRoutes'));
app.use('/api/chatbot',   require('./chatbot/chatbotRoutes'));

// ── Error Handler ──────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Handle port conflicts (EADDRINUSE)
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error('\x1b[31m%s\x1b[0m', `CRITICAL ERROR: Port ${PORT} is already in use.`);
                console.error('\x1b[33m%s\x1b[0m', `Another instance of this server is already running on port ${PORT}, or another process is using it.`);
                console.error('\x1b[33m%s\x1b[0m', 'Please stop the other process and restart the server.');
                process.exit(1);
            } else {
                console.error('\x1b[31m%s\x1b[0m', `Server Error: ${error.message}`);
                process.exit(1);
            }
        });
    })
    .catch((error) => {
        console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: Database connection failed. Server not started.');
        console.error('\x1b[31m%s\x1b[0m', `Error: ${error.message}`);
        process.exit(1);
    });
