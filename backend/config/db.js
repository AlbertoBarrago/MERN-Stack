
const mongoose = require('mongoose');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: __dirname + '/../.env.test' });
} else {
    dotenv.config({ path: __dirname + '/../.env' });
}

const connectDB = async () => {
    try {
        const mongoURI = process.env.NODE_ENV === 'test'
            ? process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/mern_blueprint_test'
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