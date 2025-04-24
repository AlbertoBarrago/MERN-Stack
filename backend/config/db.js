
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.NODE_ENV === 'test'
            ? process.env.TEST_MONGO_URI
            : process.env.MONGO_URI;

        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;