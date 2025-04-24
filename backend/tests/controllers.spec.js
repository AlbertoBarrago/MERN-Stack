const itemController = require('../controllers/itemController');
const Item = require('../models/itemModel');

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

        // Add tests for item not found and unauthorized deletion
    });
});