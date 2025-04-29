const request = require('supertest');
const app = require('../../../server'); // Import your Express app
const { connectDB, closeDatabase, clearDatabase } = require('../../setup/db.test');
const User = require('../../../models/userModel');

describe('User Routes', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    afterEach(async () => await clearDatabase());
    afterAll(async () => await closeDatabase());

    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('token');
            expect(response.body.name).toBe('Test User');
            expect(response.body.email).toBe('test@example.com');
            expect(response.body).not.toHaveProperty('password');
        });

        it('should return 400 for duplicate email', async () => {
            // Create a user first
            await User.create({
                name: 'Existing User',
                email: 'existing@example.com',
                password: 'password123'
            });

            // Try to register with the same email
            const userData = {
                name: 'Duplicate User',
                email: 'existing@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 400 for missing required fields', async () => {
            const userData = {
                name: 'Incomplete User',
                // Missing email
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData);

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/users/login', () => {
        it('should login a user with valid credentials', async () => {
            // Create a user first
            const userData = {
                name: 'Login Test User',
                email: 'login@example.com',
                password: 'password123'
            };

            await request(app)
                .post('/api/users/register')
                .send(userData);

            // Login with the created user
            const loginData = {
                email: 'login@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('token');
            expect(response.body.name).toBe('Login Test User');
            expect(response.body.email).toBe('login@example.com');
        });

        it('should return 401 for invalid email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData);

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid password', async () => {
            // Create a user first
            const userData = {
                name: 'Password Test User',
                email: 'password@example.com',
                password: 'correctpassword'
            };

            await request(app)
                .post('/api/users/register')
                .send(userData);

            // Try to login with wrong password
            const loginData = {
                email: 'password@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData);

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/users/profile', () => {
        it('should return user profile for authenticated user', async () => {
            // Register a user to get token
            const userData = {
                name: 'Profile User',
                email: 'profile@example.com',
                password: 'password123'
            };

            const registerResponse = await request(app)
                .post('/api/users/register')
                .send(userData);

            const token = registerResponse.body.token;

            // Get user profile
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.name).toBe('Profile User');
            expect(response.body.email).toBe('profile@example.com');
        });
    });
});