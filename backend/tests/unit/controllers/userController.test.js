const userController = require('../../../controllers/userController');
const User = require('../../../models/userModel');
const jwt = require('jsonwebtoken');

jest.mock('../../../models/userModel');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {},
            body: {},
            query: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };

        next = jest.fn();

        process.env.JWT_SECRET = 'test_secret';
        process.env.JWT_EXPIRES_IN = '30d';
    });

    describe('registerUser', () => {
        it('should register a new user', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedpassword'
            };

            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            User.create.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('test-token');

            await userController.registerUser(req, res);

            expect(User.create).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'user123' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                token: 'test-token'
            });
        });

        it('should handle validation errors', async () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                // Missing password
            };

            const validationError = new Error('Validation failed');
            validationError.name = 'ValidationError';

            User.create.mockRejectedValue(validationError);

            await expect(userController.registerUser(req, res)).rejects.toThrow('Validation failed');

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should handle duplicate email errors', async () => {
            req.body = {
                name: 'Test User',
                email: 'existing@example.com',
                password: 'password123'
            };

            const duplicateError = new Error('Duplicate key error');
            duplicateError.code = 11000;

            User.create.mockRejectedValue(duplicateError);

            await expect(userController.registerUser(req, res)).rejects.toThrow('User already exists');

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('loginUser', () => {
        it('should login a user with valid credentials', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedpassword',
                matchPassword: jest.fn().mockResolvedValue(true)
            };

            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('test-token');

            await userController.loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mockUser.matchPassword).toHaveBeenCalledWith('password123');
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'user123' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            expect(res.json).toHaveBeenCalledWith({
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                token: 'test-token'
            });
        });

        it('should return 401 for invalid email', async () => {
            req.body = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(null);

            await expect(userController.loginUser(req, res)).rejects.toThrow('Invalid email or password');

            expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should return 401 for invalid password', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedpassword',
                matchPassword: jest.fn().mockResolvedValue(false)
            };

            req.body = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            User.findOne.mockResolvedValue(mockUser);

            await expect(userController.loginUser(req, res)).rejects.toThrow('Invalid email or password');

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mockUser.matchPassword).toHaveBeenCalledWith('wrongpassword');
            expect(res.status).toHaveBeenCalledWith(401);
        });
    });

    describe('getUserProfile', () => {
        it('should return user profile', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com'
            };

            req.user = mockUser;

            await userController.getUserProfile(req, res);

            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    });
});