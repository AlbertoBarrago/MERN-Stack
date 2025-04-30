const jwt = require('jsonwebtoken');
const { protect } = require('../../../middleware/authMiddleware');
const User = require('../../../models/userModel');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../../models/userModel');

describe('Auth Middleware', () => {
    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        process.env.TEST_MIDDLEWARE = 'true';
    });

    afterAll(() => {
        delete process.env.TEST_MIDDLEWARE;
    });
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

    it('should return 401 if no token is provided', async () => {
        // Arrange
        req.headers.authorization = undefined;

        // Act
        await protect(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token format is invalid', async () => {
        // Arrange
        req.headers.authorization = 'InvalidFormat';

        // Act
        await protect(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
        // Arrange
        const mockSelectNull = jest.fn().mockResolvedValue(null);
        User.findById = jest.fn().mockReturnValue({
            select: mockSelectNull
        });

        // Act
        await protect(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, user not found' });
        expect(next).not.toHaveBeenCalled();
    });
});