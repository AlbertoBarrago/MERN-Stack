
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.NODE_ENV === 'test'
            ? process.env.TEST_MONGO_URI
            : process.env.MONGO_URI;

        if (process.env.NODE_ENV === 'test') {
            console.log('Test environment detected - skipping main DB connection');
            return null;
        }

        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;