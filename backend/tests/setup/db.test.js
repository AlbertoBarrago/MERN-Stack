const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to the in-memory database.
 */
const connectDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
};

/**
 * Drop a database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

module.exports = {
    connectDB,
    closeDatabase,
    clearDatabase
};