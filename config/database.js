const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Try different database URL sources
        const dbURL = process.env.DATABASE_URL || 
                     process.env.ATLASDB_URL || 
                     process.env.MONGODB_URI || 
                     'mongodb://127.0.0.1:27017/majorproject';

        console.log('Attempting to connect to database...');
        console.log('Database URL:', dbURL.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

        const conn = await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('Database connection error:', error.message);
        
        // If it's a network error, provide helpful message
        if (error.message.includes('ENOTFOUND')) {
            console.error('Network error: Cannot reach database server');
            console.error('Please check:');
            console.error('1. Database URL is correct');
            console.error('2. Network connectivity');
            console.error('3. Database server is running');
        }
        
        throw error;
    }
};

module.exports = connectDB;
