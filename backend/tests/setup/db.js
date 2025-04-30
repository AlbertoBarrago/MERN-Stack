const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to the in-memory database.
 */
const connectDB = async () => {
    try {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        // Set connection options
        const mongooseOpts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        await mongoose.connect(mongoUri, mongooseOpts);

        console.log('MongoDB Memory Server Connected');
        return mongoose.connection;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};

/**
 * Drop a database, close the connection and stop mongodb.
 */
const closeDatabase = async () => {
    if (mongoServer) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    }
};

/**
 * Clear all collections from the database
 */
const clearDatabase = async () => {
    if (mongoServer) {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
};

module.exports = {
    connectDB,
    closeDatabase,
    clearDatabase
};