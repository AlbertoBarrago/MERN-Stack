/**
 * Mock Data for MERN Blueprint
 * 
 * This file contains sample data structures that can be used to populate your MongoDB database.
 * You can use these structures as templates when creating your own data.
 */

const bcrypt = require('bcryptjs');

// Sample Users
const mockUsers = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123' // This would be hashed in the actual database
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123'
    }
];

// Sample Items
const mockItems = [
    {
        // This would be linked to a user ID in the actual database
        // user: '60d0fe4f5311236168a109ca', 
        name: 'iPhone 13',
        description: 'Latest model of iPhone with advanced features',
        category: 'Electronics',
        price: 999.99,
        quantity: 10,
        isAvailable: true
    },
    {
        // user: '60d0fe4f5311236168a109ca',
        name: 'Nike Air Max',
        description: 'Comfortable running shoes with air cushioning',
        category: 'Clothing',
        price: 129.99,
        quantity: 25,
        isAvailable: true
    },
    {
        // user: '60d0fe4f5311236168a109cb',
        name: 'The Great Gatsby',
        description: 'Classic novel by F. Scott Fitzgerald',
        category: 'Books',
        price: 14.99,
        quantity: 50,
        isAvailable: true
    },
    {
        // user: '60d0fe4f5311236168a109cb',
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with timer',
        category: 'Home',
        price: 49.99,
        quantity: 15,
        isAvailable: true
    },
    {
        // user: '60d0fe4f5311236168a109cc',
        name: 'Yoga Mat',
        description: 'Non-slip exercise mat for yoga and fitness',
        category: 'Sports',
        price: 29.99,
        quantity: 30,
        isAvailable: true
    }
];

// Example of how to use these mock objects in your application
console.log('\n=== MOCK DATA EXAMPLES ===');

// Example: Creating a user
console.log('\n--- USER EXAMPLE ---');
console.log('To create a user in your application:');
console.log(`
const newUser = new User({
  name: '${mockUsers[0].name}',
  email: '${mockUsers[0].email}',
  password: '${mockUsers[0].password}'
});

await newUser.save(); // The password will be automatically hashed by the pre-save hook
`);

// Example: Creating an item
console.log('\n--- ITEM EXAMPLE ---');
console.log('To create an item in your application (after creating a user):');
console.log(`
const userId = '60d0fe4f5311236168a109ca'; // This would be the actual user ID from your database
const newItem = new Item({
  user: userId,
  name: '${mockItems[0].name}',
  description: '${mockItems[0].description}',
  category: '${mockItems[0].category}',
  price: ${mockItems[0].price},
  quantity: ${mockItems[0].quantity},
  isAvailable: ${mockItems[0].isAvailable}
});

await newItem.save();
`);

// Example: MongoDB shell commands
console.log('\n--- MONGODB SHELL COMMANDS ---');
console.log('To insert documents directly in MongoDB shell:');

console.log(`
// Insert a user
db.users.insertOne({
  name: '${mockUsers[1].name}',
  email: '${mockUsers[1].email}',
  password: '${mockUsers[1].password}' // Note: This would normally be hashed
});

// Insert an item
db.items.insertOne({
  user: ObjectId('60d0fe4f5311236168a109ca'), // Reference to a user ID
  name: '${mockItems[1].name}',
  description: '${mockItems[1].description}',
  category: '${mockItems[1].category}',
  price: ${mockItems[1].price},
  quantity: ${mockItems[1].quantity},
  isAvailable: ${mockItems[1].isAvailable}
});
`);

console.log('\n=== END OF MOCK DATA EXAMPLES ===\n');

module.exports = {
    mockUsers,
    mockItems
};