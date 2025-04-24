const mongoose = require('mongoose');
const { connectDB, closeDatabase, clearDatabase } = require('../config/db.test');

describe('Database Connection', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    it('should connect to the in-memory database', () => {
        expect(mongoose.connection.readyState).toBe(1);
    });

    it('should save a document to the database', async () => {
        const testSchema = new mongoose.Schema({
            name: String,
            value: Number
        });
        const TestModel = mongoose.model('Test', testSchema);

        // Create and save a test document
        const testDoc = new TestModel({ name: 'test', value: 42 });
        await testDoc.save();

        // Find the document
        const foundDoc = await TestModel.findOne({ name: 'test' });

        // Assert
        expect(foundDoc.name).toBe('test');
        expect(foundDoc.value).toBe(42);
    });
});