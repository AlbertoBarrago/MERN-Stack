const itemController = require('../controllers/itemController');
const userController = require("../controllers/userController");
const Item = require('../models/itemModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


jest.mock('../models/itemModel', () => {
    const mockSort = jest.fn().mockResolvedValue([]);
    const mockLimit = jest.fn().mockReturnValue({ sort: mockSort });
    const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockFind = jest.fn().mockReturnValue({ skip: mockSkip });

    return {
        find: mockFind,
        countDocuments: jest.fn().mockResolvedValue(0),
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        prototype: {
            deleteOne: jest.fn()
        }
    };
});
jest.mock('jsonwebtoken');
jest.mock('../models/userModel');


describe('Item Controller', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {},
            body: {},
            query: {},
            user: { _id: 'user123' }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
    });

    describe('getItem', () => {
        it('should return a single item when found', async () => {
            const mockItem = { _id: 'item1', name: 'Item 1', user: 'user123' };
            req.params.id = 'item1';

            Item.findById.mockResolvedValue(mockItem);

            await itemController.getItem(req, res);

            expect(Item.findById).toHaveBeenCalledWith('item1');
            expect(res.json).toHaveBeenCalledWith(mockItem);
        });

        it('should return 404 when item not found', async () => {
            req.params.id = 'nonexistent';

            Item.findById.mockResolvedValue(null);

            // Expect an error to be thrown
            await expect(itemController.getItem(req, res)).rejects.toThrow('Item not found');

            expect(Item.findById).toHaveBeenCalledWith('nonexistent');
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getItems', () => {
        it('should return a list of items', async () => {
            const mockItems = [
                { _id: 'item1', name: 'Item 1', user: 'user123' },
                { _id: 'item2', name: 'Item 2', user: 'user123' }
            ];


            // Set up request query params
            req.query = {
                page: '1',
                limit: '10',
                category: 'Test',
                available: 'true'
            };


            // Setup expected filter object
            const expectedFilter = {
                category: 'Test',
                isAvailable: true
            };

            // Reconfigure mocks for this specific test
            const mockSort = jest.fn().mockResolvedValue(mockItems);
            const mockLimit = jest.fn().mockReturnValue({ sort: mockSort });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });

            // Replace the find method with a new mock implementation for this test
            Item.find.mockReturnValue({ skip: mockSkip });

            // Set up countDocuments mock for this test
            Item.countDocuments.mockResolvedValue(mockItems.length);

            // Call the controller method
            await itemController.getItems(req, res);

            // Verify the correct methods were called with the right parameters
            expect(Item.find).toHaveBeenCalledWith(expectedFilter);
            expect(Item.countDocuments).toHaveBeenCalledWith(expectedFilter);

            // The result JSON should match our expected output
            expect(res.json).toHaveBeenCalledWith({
                items: mockItems,
                pagination: {
                    total: 2,
                    pages: 1,
                    currentPage: 1,
                    perPage: 10,
                }
            });
        });

    })

    describe('createItem', () => {
        it('should create a new item with valid data', async () => {
            const itemData = {
                name: 'New Item',
                description: 'Test Description',
                category: 'Test Category',
                price: 9.99
            };

            req.body = itemData;

            const createdItem = {
                _id: 'newItemId',
                ...itemData,
                user: 'user123',
                quantity: 1,
                isAvailable: true
            };

            Item.create.mockResolvedValue(createdItem);

            await itemController.createItem(req, res);

            expect(Item.create).toHaveBeenCalledWith({
                user: 'user123',
                ...itemData,
                quantity: 1,
                isAvailable: true
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(createdItem);
        });

        it('should return 400 when required fields are missing', async () => {
            // Missing description
            req.body = {
                name: 'Incomplete Item',
                category: 'Test',
                price: 19.99
            };

            await expect(itemController.createItem(req, res)).rejects.toThrow('Please provide all required fields');

            expect(res.status).toHaveBeenCalledWith(400);
            expect(Item.create).not.toHaveBeenCalled();
        });
    });

    describe('updateItem', () => {
        it('should update an item when authorized', async () => {
            const itemId = 'item123';
            req.params.id = itemId;
            req.body = { name: 'Updated Name' };

            const existingItem = {
                _id: itemId,
                name: 'Original Name',
                user: { toString: () => 'user123' }
            };

            const updatedItem = {
                _id: itemId,
                name: 'Updated Name',
                user: 'user123'
            };

            Item.findById.mockResolvedValue(existingItem);
            Item.findByIdAndUpdate.mockResolvedValue(updatedItem);

            await itemController.updateItem(req, res);

            expect(Item.findById).toHaveBeenCalledWith(itemId);
            expect(Item.findByIdAndUpdate).toHaveBeenCalledWith(
                itemId,
                { name: 'Updated Name' },
                { new: true, runValidators: true }
            );
            expect(res.json).toHaveBeenCalledWith(updatedItem);
        });

        it('should return 404 when item not found', async () => {
            req.params.id = 'nonexistent';

            Item.findById.mockResolvedValue(null);

            await expect(itemController.updateItem(req, res)).rejects.toThrow('Item not found');

            expect(res.status).toHaveBeenCalledWith(404);
            expect(Item.findByIdAndUpdate).not.toHaveBeenCalled();
        });

        it('should return 401 when user is not authorized', async () => {
            const itemId = 'item123';
            req.params.id = itemId;

            const existingItem = {
                _id: itemId,
                name: 'Original Name',
                user: { toString: () => 'differentUser' }
            };

            Item.findById.mockResolvedValue(existingItem);

            await expect(itemController.updateItem(req, res)).rejects.toThrow('Not authorized to update this item');

            expect(res.status).toHaveBeenCalledWith(401);
            expect(Item.findByIdAndUpdate).not.toHaveBeenCalled();
        });
    });

    describe('deleteItem', () => {
        it('should delete an item when authorized', async () => {
            const itemId = 'item123';
            req.params.id = itemId;

            const mockItem = {
                _id: itemId,
                user: { toString: () => 'user123' },
                deleteOne: jest.fn().mockResolvedValue({})
            };

            Item.findById.mockResolvedValue(mockItem);

            await itemController.deleteItem(req, res);

            expect(Item.findById).toHaveBeenCalledWith(itemId);
            expect(mockItem.deleteOne).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: 'Item removed' });
        });
    });
});

describe('User Controller', () => {
    let req, res, next;
    const userId = 'user123';
    const mockToken = 'test-token';

    beforeEach(() => {
        jest.clearAllMocks();

        // Set environment variable for JWT_SECRET and JWT_EXPIRE
        process.env.JWT_SECRET = 'test_secret';
        process.env.JWT_EXPIRE = '1d';

        // Setup request, response and next objects
        req = {
            params: {},
            body: {},
            user: { _id: userId },
            headers: {
                authorization: `Bearer ${mockToken}`
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        // Mock jwt.sign to return a fixed token
        jwt.sign.mockReturnValue(mockToken);
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            req.body = userData;

            const createdUser = {
                _id: userId,
                ...userData
            };

            User.findOne.mockResolvedValue(null); // User doesn't exist yet
            User.create.mockResolvedValue(createdUser);


            await userController.registerUser(req, res);


            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
            expect(User.create).toHaveBeenCalledWith(userData);
            expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                _id: userId,
                name: userData.name,
                email: userData.email,
                token: mockToken
            });
        });

        it('should return 400 if required fields are missing', async () => {
            req.body = {
                name: 'Test User',
                password: 'password123'
            };

            // Act & Assert
            await expect(userController.registerUser(req, res)).rejects.toThrow('Please provide all required fields');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(User.create).not.toHaveBeenCalled();
        });

        it('should return 400 if user already exists', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            req.body = userData;

            User.findOne.mockResolvedValue({ _id: 'existing-user' });

            // Act & Assert
            await expect(userController.registerUser(req, res)).rejects.toThrow('User already exists');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(User.create).not.toHaveBeenCalled();
        });

        it('should handle case when user creation fails', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            req.body = userData;

            User.findOne.mockResolvedValue(null); // User doesn't exist yet
            User.create.mockResolvedValue(null); // Creation fails

            // Act & Assert
            await expect(userController.registerUser(req, res)).rejects.toThrow('Invalid user data');
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('loginUser', () => {
        it('should login user with valid credentials', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123'
            };

            req.body = userData;

            const foundUser = {
                _id: userId,
                name: 'Test User',
                email: userData.email,
                matchPassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(foundUser);

            // Act
            await userController.loginUser(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
            expect(foundUser.matchPassword).toHaveBeenCalledWith(userData.password);
            expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            });
            expect(res.json).toHaveBeenCalledWith({
                _id: userId,
                name: 'Test User',
                email: userData.email,
                token: mockToken
            });
        });

        it('should return 401 if email is not found', async () => {
            req.body = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(null); // User not found

            // Act & Assert
            await expect(userController.loginUser(req, res)).rejects.toThrow('Invalid email or password');
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should return 401 if password does not match', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            const foundUser = {
                _id: userId,
                name: 'Test User',
                email: req.body.email,
                matchPassword: jest.fn().mockResolvedValue(false) // Password doesn't match
            };

            User.findOne.mockResolvedValue(foundUser);

            // Act & Assert
            await expect(userController.loginUser(req, res)).rejects.toThrow('Invalid email or password');
            expect(res.status).toHaveBeenCalledWith(401);
        });
    });

    describe('getUserProfile', () => {
        it('should return user profile for authenticated user', async () => {
            const foundUser = {
                _id: userId,
                name: 'Test User',
                email: 'test@example.com'
            };

            User.findById.mockResolvedValue(foundUser);

            // Act
            await userController.getUserProfile(req, res);

            // Assert
            expect(User.findById).toHaveBeenCalledWith(userId);
            expect(res.json).toHaveBeenCalledWith({
                _id: userId,
                name: 'Test User',
                email: 'test@example.com'
            });
        });

        it('should return 404 if user not found', async () => {
            //
            User.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(userController.getUserProfile(req, res)).rejects.toThrow('User not found');
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile with all fields', async () => {
            const updateData = {
                name: 'Updated Name',
                email: 'updated@example.com',
                password: 'newpassword123'
            };

            req.body = updateData;

            const existingUser = {
                _id: userId,
                name: 'Test User',
                email: 'test@example.com',
                save: jest.fn().mockResolvedValue({
                    _id: userId,
                    name: updateData.name,
                    email: updateData.email
                })
            };

            User.findById.mockResolvedValue(existingUser);

            // Act
            await userController.updateUserProfile(req, res);

            // Assert
            expect(User.findById).toHaveBeenCalledWith(userId);
            expect(existingUser.name).toBe(updateData.name);
            expect(existingUser.email).toBe(updateData.email);
            expect(existingUser.password).toBe(updateData.password);
            expect(existingUser.save).toHaveBeenCalled();
            expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            });
            expect(res.json).toHaveBeenCalledWith({
                _id: userId,
                name: updateData.name,
                email: updateData.email,
                token: mockToken
            });
        });

        it('should update user profile without password', async () => {
            const updateData = {
                name: 'Updated Name',
                email: 'updated@example.com'
            };

            req.body = updateData;

            const existingUser = {
                _id: userId,
                name: 'Test User',
                email: 'test@example.com',
                save: jest.fn().mockResolvedValue({
                    _id: userId,
                    name: updateData.name,
                    email: updateData.email
                })
            };

            User.findById.mockResolvedValue(existingUser);

            // Act
            await userController.updateUserProfile(req, res);

            // Assert
            expect(User.findById).toHaveBeenCalledWith(userId);
            expect(existingUser.name).toBe(updateData.name);
            expect(existingUser.email).toBe(updateData.email);
            expect(existingUser.password).toBeUndefined();
            expect(existingUser.save).toHaveBeenCalled();
        });

        it('should keep existing fields if not provided in update', async () => {
            const updateData = {
                name: 'Updated Name'
                // email not provided
            };

            req.body = updateData;

            const existingUser = {
                _id: userId,
                name: 'Test User',
                email: 'test@example.com',
                save: jest.fn().mockResolvedValue({
                    _id: userId,
                    name: updateData.name,
                    email: 'test@example.com'
                })
            };

            User.findById.mockResolvedValue(existingUser);

            // Act
            await userController.updateUserProfile(req, res);

            // Assert
            expect(existingUser.name).toBe(updateData.name);
            expect(existingUser.email).toBe('test@example.com'); // Should be unchanged
        });

        it('should return 404 if user not found', async () => {
            //
            User.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(userController.updateUserProfile(req, res)).rejects.toThrow('User not found');
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getUsersFromToken', () => {
        it('should get user info from a valid token', async () => {
            const decodedToken = { id: userId };
            jwt.verify.mockReturnValue(decodedToken);

            const foundUser = {
                _id: userId,
                name: 'Test User',
                email: 'test@example.com'
            };

            User.findById.mockResolvedValue(foundUser);

            // Act
            await userController.getUsersFromToken(req, res);

            // Assert
            expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
            expect(User.findById).toHaveBeenCalledWith(userId);
            expect(res.json).toHaveBeenCalledWith({
                _id: userId,
                name: 'Test User',
                email: 'test@example.com'
            });
        });

        it('should return 404 if user not found from token', async () => {
            //
            const decodedToken = { id: userId };
            jwt.verify.mockReturnValue(decodedToken);
            User.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(userController.getUsersFromToken(req, res)).rejects.toThrow('User not found');
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should handle invalid token format', async () => {
            //  - bad token format in header
            req.headers.authorization = 'InvalidFormat';

            // Act & Assert
            await expect(userController.getUsersFromToken(req, res)).rejects.toThrow();
        });

        it('should handle jwt verification errors', async () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            // Act & Assert
            await expect(userController.getUsersFromToken(req, res)).rejects.toThrow('Invalid token');
        });
    });

    describe('generateToken', () => {
        it('should generate a JWT token with correct parameters', () => {
            userController.generateToken(userId);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: userId },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );
        });
    });
});
