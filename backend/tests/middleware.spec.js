const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const { errorHandler } = require('../middleware/errorMiddleware');


// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/userModel');

describe('Auth Middleware', () => {
    let req, res, next;
    const userId = 'user123';
    const mockToken = 'test-token';
    const mockUser = {
        _id: userId,
        name: 'Test User',
        email: 'test@example.com'
    };

    beforeEach(() => {
        jest.clearAllMocks();

        process.env.JWT_SECRET = 'test_secret';

        // Setup request, response and next objects
        req = {
            headers: {
                authorization: `Bearer ${mockToken}`
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        // Configure default mock implementation for jwt.verify
        jwt.verify.mockReturnValue({ id: userId });

        // Important: This is the correct way to mock a Mongoose chain
        const mockSelect = jest.fn().mockResolvedValue(mockUser);
        User.findById = jest.fn().mockReturnValue({
            select: mockSelect
        });
    });

    it('should verify token and set user on request object', async () => {
        // Act
        await protect(req, res, next);

        // Assert
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
        expect(User.findById).toHaveBeenCalledWith(userId);
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
    });

});

describe('Error Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            statusCode: 200,
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should handle error with status 500 when res.statusCode is 200', () => {
        const error = new Error('Server Error');

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Server Error',
            stack: error.stack
        });
    });

    test('should use existing status code when not 200', () => {
        const error = new Error('Not Found');
        res.statusCode = 404;

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Not Found',
            stack: error.stack
        });
    });

    test('should not include stack trace in production environment', () => {
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        const error = new Error('Production Error');

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Production Error',
            stack: null
        });

        // Restore NODE_ENV
        process.env.NODE_ENV = originalNodeEnv;
    });

    test('should include stack trace in non-production environment', () => {
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const error = new Error('Development Error');

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Development Error',
            stack: error.stack
        });

        // Restore NODE_ENV
        process.env.NODE_ENV = originalNodeEnv;
    });
});


