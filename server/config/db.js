const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to MongoDB Atlas/Local
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Atlas Connected Successfully');
        console.log(`Database Host: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
