const request = require('supertest');
const { app, closeServer } = require('../../../server');
const { connectDB, closeDatabase, clearDatabase } = require('../../setup/db');
const Item = require('../../../models/itemModel');
const User = require('../../../models/userModel');

describe('Item Routes', () => {
    let token;
    let userId;


    beforeAll(async () => {
        await connectDB();
        token = 'test-token';
        userId = '746573742d757365722d6964'; // We use a hardcoded ID for testing
    });

    afterEach(async () => await clearDatabase());
    afterAll(async () => {
        await closeDatabase()
        closeServer()
    });

    describe('GET /api/items', () => {
        it('should return all items for authenticated user', async () => {
            // Create test items
            await Item.create([
                {
                    user: userId,
                    name: 'New Item',
                    description: 'Test Description',
                    category: 'Test Category',
                    price: 9.99,
                    isAvailable: true 
                },
                {
                    user: userId,
                    name: 'New Item',
                    description: 'Test Description',
                    category: 'Test Category',
                    price: 9.99,
                    isAvailable: true
                }
            ]);

            const response = await request(app)
                .get('/api/items')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.items).toHaveLength(2);
            expect(response.body.items[0]).toHaveProperty('name');
            expect(response.body.items[1]).toHaveProperty('description');
        });
    });

    describe('POST /api/items', () => {
        it('should create a new item', async () => {
            const newItem =  {
                user: userId,
                name: 'New Item',
                description: 'Test Description',
                category: 'Test Category',
                price: 9.99,
                isAvailable: true
            };

            const response = await request(app)
                .post('/api/items')
                .set('Authorization', `Bearer ${token}`)
                .send(newItem);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.name).toBe('New Item');
            expect(response.body.user).toBe('746573742d757365722d6964');
        });

        it('should return 400 for bad request', async () => {
            const newItem = {
                name: 'New Test Item',
                description: 'New Description'
            };

            const response = await request(app)
                .post('/api/items')
                .send(newItem);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/items/:id', () => {
        it('should return a single item by ID', async () => {
            // Create a test item
            const item = await Item.create({
                user: userId,
                name: 'New Item',
                description: 'Test Description',
                category: 'Test Category',
                price: 9.99,
                isAvailable: true 
            });

            const response = await request(app)
                .get(`/api/items/${item._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body._id).toBe(item._id.toString());
            expect(response.body.name).toBe('New Item');
        });

        it('should return 404 for non-existent item', async () => {
            const response = await request(app)
                .get('/api/items/60f1a5c5f32d8a2a58b7a123') // Non-existent ID
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/items/:id', () => {
        it('should update an existing item', async () => {
            // Create a test item
            const item = await Item.create({
                user: userId,
                name: 'New Item',
                description: 'Test Description',
                category: 'Test Category',
                price: 9.99,
                isAvailable: true 
            });

            const updateData = {
                name: 'Updated Item Name',
                description: 'Updated Description'
            };

            const response = await request(app)
                .put(`/api/items/${item._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Updated Item Name');
            expect(response.body.description).toBe('Updated Description');
        });

        it('should return 401 when trying to update another user\'s item', async () => {
            // Create another user
            const anotherUserData = {
                name: 'Another User',
                email: 'another@example.com',
                password: 'password123'
            };

            const anotherUser = await User.create(anotherUserData);

            // Create an item owned by another user
            const item = await Item.create({
                description: 'Not My Item',
                user: anotherUser._id,
                name: 'New Item',
                description: 'Test Description',
                category: 'Test Category',
                price: 9.99,
                isAvailable: true 
            });

            const updateData = {
                name: 'Trying to Update',
                description: 'Should Fail'
            };

            const response = await request(app)
                .put(`/api/items/${item._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateData);

            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /api/items/:id', () => {
        it('should delete an existing item', async () => {
            // Create a test item
            const item = await Item.create({
                user: userId,
                name: 'New Item',
                description: 'Test Description',
                category: 'Test Category',
                price: 9.99,
                isAvailable: true 
            });

            const response = await request(app)
                .delete(`/api/items/${item._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(item._id.toString());

            // Verify item is deleted
            const deletedItem = await Item.findById(item._id);
            expect(deletedItem).toBeNull();
        });

        it('should return 401 when trying to delete another user\'s item', async () => {
            // Create another user
            const anotherUserData = {
                name: 'Another User',
                email: 'another2@example.com',
                password: 'password123'
            };

            const anotherUser = await User.create(anotherUserData);

            // Create an item owned by another user
            const item = await Item.create({
                name: 'New Item',
                description: 'Test Description',
                category: 'Test Category',
                price: 9.99,
                isAvailable: true,
                user: anotherUser._id
            });

            const response = await request(app)
                .delete(`/api/items/${item._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(401);
        });
    });
});