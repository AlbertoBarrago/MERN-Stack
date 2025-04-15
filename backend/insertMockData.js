/**
 * Insert Mock Data Script
 * 
 * This script inserts mock data directly into your MongoDB database.
 * Run this script with: node backend/insertMockData.js
 * 
 * Make sure your MongoDB connection is properly configured in your .env file.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Item = require('./models/itemModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');

// Function to insert mock data
async function insertMockData() {
    try {
        // Connect to the database
        await connectDB();
        console.log('Connected to MongoDB');

        // Create users
        console.log('Creating users...');
        const user1 = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123' // Will be hashed by the pre-save hook
        });

        const user2 = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        });

        const user3 = await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123'
        });

        console.log(`Created ${3} users`);

        // Create items
        console.log('Creating items...');
        const items = [
            {
                user: user1._id,
                name: 'iPhone 13',
                description: 'Latest model of iPhone with advanced features',
                category: 'Electronics',
                price: 999.99,
                quantity: 10,
                isAvailable: true
            },
            {
                user: user1._id,
                name: 'MacBook Pro',
                description: 'Powerful laptop for professionals',
                category: 'Electronics',
                price: 1999.99,
                quantity: 5,
                isAvailable: true
            },
            {
                user: user2._id,
                name: 'Nike Air Max',
                description: 'Comfortable running shoes with air cushioning',
                category: 'Clothing',
                price: 129.99,
                quantity: 25,
                isAvailable: true
            },
            {
                user: user2._id,
                name: 'Levi\'s Jeans',
                description: 'Classic denim jeans',
                category: 'Clothing',
                price: 59.99,
                quantity: 30,
                isAvailable: true
            },
            {
                user: user3._id,
                name: 'The Great Gatsby',
                description: 'Classic novel by F. Scott Fitzgerald',
                category: 'Books',
                price: 14.99,
                quantity: 50,
                isAvailable: true
            },
            {
                user: user3._id,
                name: 'Coffee Maker',
                description: 'Programmable coffee maker with timer',
                category: 'Home',
                price: 49.99,
                quantity: 15,
                isAvailable: true
            },
            {
                user: user3._id,
                name: 'Yoga Mat',
                description: 'Non-slip exercise mat for yoga and fitness',
                category: 'Sports',
                price: 29.99,
                quantity: 30,
                isAvailable: true
            }
        ];

        const createdItems = await Item.insertMany(items);
        console.log(`Created ${createdItems.length} items`);

        console.log('Mock data inserted successfully!');

        // Close the connection
        mongoose.connection.close();
        console.log('Database connection closed');

    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.code === 11000) {
            console.error('Duplicate key error: Some records already exist in the database.');
            console.error('Try running with different email addresses or delete existing records first.');
        }
        process.exit(1);
    }
}

// Run the function
insertMockData();