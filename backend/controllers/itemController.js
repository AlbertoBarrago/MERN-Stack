const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');

/**
 * @desc    Get all items
 * @route   GET /api/items
 * @access  Public
 */
const getItems = asyncHandler(async (req, res) => {
    // Set up pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Set up filtering
    const filter = {};
    if (req.query.category) {
        filter.category = req.query.category;
    }
    if (req.query.available === 'true') {
        filter.isAvailable = true;
    }

    // Execute a query with pagination
    const items = await Item.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    // Get total count for pagination info
    const count = await Item.countDocuments(filter);

    res.status(200).json({
        items,
        pagination: {
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: page,
            perPage: limit,
        },
    });
});

/**
 * @desc    Get single item
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (item) {
        res.status(200).json(item);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

/**
 * @desc    Create a new item
 * @route   POST /api/items
 * @access  Private
 */
const createItem = asyncHandler(async (req, res) => {
    const { name, description, category, price, quantity, isAvailable } = req.body;

    // Validation
    if (!name || !description || !category || price === undefined) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Create item
    const item = await Item.create({
        user: req.user._id,
        name,
        description,
        category,
        price,
        quantity: quantity || 1,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    if (item) {
        res.status(201).json(item);
    } else {
        res.status(400);
        throw new Error('Invalid item data');
    }
});

/**
 * @desc    Update an item
 * @route   PUT /api/items/:id
 * @access  Private
 */
const updateItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    // Check if user is the item owner
    if (item.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this item');
    }

    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedItem);
});

/**
 * @desc    Delete an item
 * @route   DELETE /api/items/:id
 * @access  Private
 */
const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    // Check if the user is the item owner
    if (item.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this item');
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item removed' });
});

module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
};