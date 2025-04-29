/**
 * This file contains helper functions for testing
 */

const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const Item = require('../../models/itemModel');

/**
 * Generate a JWT token for testing
 * @param {string} userId - The user ID to include in the token
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test_secret', {
        expiresIn: '1h'
    });
};

/**
 * Create a test user and return with token
 * @param {Object} userData - User data (optional)
 * @returns {Promise<Object>} User object with token
 */
const createTestUser = async (userData = {}) => {
    const defaultUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };

    const user = await User.create({
        ...defaultUser,
        ...userData
    });

    const token = generateToken(user._id);

    return {
        user,
        token
    };
};

/**
 * Create multiple test items for a user
 * @param {string} userId - User ID who owns the items
 * @param {number} count - Number of items to create (default: 3)
 * @returns {Promise<Array>} Array of created items
 */
const createTestItems = async (userId, count = 3) => {
    const items = [];

    for (let i = 0; i < count; i++) {
        items.push({
            name: `Test Item ${i + 1}`,
            description: `Description for test item ${i + 1}`,
            category: i % 2 === 0 ? 'Category A' : 'Category B',
            isAvailable: i % 2 === 0,
            user: userId
        });
    }

    return await Item.insertMany(items);
};

module.exports = {
    generateToken,
    createTestUser,
    createTestItems
};