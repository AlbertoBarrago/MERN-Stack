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

            expect(res.status).toHaveBeenCalledWith(201);
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

            await expect(userController.registerUser(req, res)).rejects.toThrow('Please provide all required fields');

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

            await expect(userController.registerUser(req, res)).rejects.toThrow('Duplicate key error');
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
    
    describe('getProfileUser', () => {
        it('should retrieve a user profile', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com'
            };

            req.user = { _id: 'user123' };

            User.findById = jest.fn().mockResolvedValue(mockUser);

            // Call the function
            await userController.getUserProfile(req, res);

            // Check expectations
            expect(User.findById).toHaveBeenCalledWith('user123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 if not found user', async () => {
            req.user = { _id: 'user127' };
            User.findById = jest.fn().mockResolvedValue(null);
            await expect(userController.getUserProfile(req, res)).rejects.toThrow('User not found');
            expect(res.status).toHaveBeenCalledWith(404);
        })
    });

    describe('updateUserProfile', () => {
        xit('should update user profile successfully', async () => {
            const originalGenerateToken = userController.generateToken;
            userController.generateToken = jest.fn().mockReturnValue('new-test-token');

            // Initial user data
            const existingUser = {
                _id: 'user123',
                name: 'Original Name',
                email: 'original@example.com',
                password: 'hashedpassword',
                save: jest.fn().mockResolvedValue({
                    _id: 'user123',
                    name: 'New Name',
                    email: 'new@example.com',
                    password: 'newhashed'
                })
            };

            // Mock the User.findById to return the existing user
            User.findById.mockResolvedValue(existingUser);

            // Set up request
            req.user = { _id: 'user123' };
            req.body = {
                name: 'New Name',
                email: 'new@example.com',
                password: 'newpassword123'
            };

            // Call the function
            await userController.updateUserProfile(req, res);

            // Check if the user properties were updated correctly
            expect(existingUser.name).toBe('New Name');
            expect(existingUser.email).toBe('new@example.com');
            expect(existingUser.password).toBe('newpassword123');

            // Check if save was called
            expect(existingUser.save).toHaveBeenCalled();

            // Check if generateToken was called with the correct ID
            expect(userController.generateToken).toHaveBeenCalledWith('user123');

            // Check response
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                _id: 'user123',
                name: 'New Name',
                email: 'new@example.com',
                token: 'new-test-token'
            });

            // Restore the original function after the test
            userController.generateToken = originalGenerateToken;
        });

        it('should return 404 if user not found', async () => {
            // Mock User.findById to return null (user not found)
            User.findById.mockResolvedValue(null);

            // Set up request
            req.user = { _id: 'nonexistentuser' };
            req.body = { name: 'New Name' };

            // Call and expect error
            await expect(userController.updateUserProfile(req, res)).rejects.toThrow('User not found');

            expect(User.findById).toHaveBeenCalledWith('nonexistentuser');
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});