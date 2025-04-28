/**
 * This file contains test data fixtures for use in tests
 */

// Sample user data
const users = [
    {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    },
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123'
    }
];

// Sample item data
const items = [
    {
        name: 'Test Item 1',
        description: 'This is test item 1',
        category: 'Test',
        isAvailable: true
    },
    {
        name: 'Test Item 2',
        description: 'This is test item 2',
        category: 'Test',
        isAvailable: false
    },
    {
        name: 'Test Item 3',
        description: 'This is test item 3',
        category: 'Another',
        isAvailable: true
    }
];

module.exports = {
    users,
    items
};