const request = require('supertest');
const app = require('../../../server');
const { connectDB, closeDatabase, clearDatabase } = require('../../setup/db.test');
const User = require('../../../models/userModel');
const { generateToken } = require('../../setup/testHelpers');

describe('Auth Middleware Integration', () => {
    let user;
    let validToken;
    let expiredToken;

    beforeAll(async () => {
        await connectDB();

        // Create a test user
        user = await User.create({
            name: 'Middleware Test User',
            email: 'middleware@example.com',
            password: 'password123'
        });

        // Generate a valid token
        validToken = generateToken(user._id);

        // Generate an expired token (using a past date)
        expiredToken = jwt.sign(
            { id: user._id, exp: Math.floor(Date.now() / 1000) - 3600 },
            process.env.JWT_SECRET || 'test_secret'
        );
    });

    afterEach(async () => await clearDatabase());
    afterAll(async () => await closeDatabase());

    // Test a protected route
    describe('Protected Route Access', () => {
        it('should allow access with valid token', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
        });

        it('should deny access with no token', async () => {
            const response = await request(app)
                .get('/api/users/profile');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Not authorized, no token');
        });

        it('should deny access with invalid token format', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', 'InvalidFormat');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Not authorized, no token');
        });

        it('should deny access with expired token', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${expiredToken}`);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Not authorized, token failed');
        });

        it('should deny access with invalid token', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', 'Bearer invalidtokenstring');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Not authorized, token failed');
        });
    });
});