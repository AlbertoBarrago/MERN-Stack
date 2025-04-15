const dotenv = require('dotenv');
const User = require('./models/userModel');
const Item = require('./models/itemModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');

connectDB();

// Sample user data
const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123'
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

// Sample item categories
const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

// Function to generate a random item
const generateRandomItem = (userId) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    return {
        user: userId,
        name: `${category} Item ${Math.floor(Math.random() * 100)}`,
        description: `This is a sample ${category.toLowerCase()} item description.`,
        category,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        quantity: Math.floor(Math.random() * 50) + 1,
        isAvailable: Math.random() > 0.2 // 80% chance of being available
    };
};

// Import data
const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Item.deleteMany();

        // Create users
        const createdUsers = await User.insertMany(users);
        console.log(`${createdUsers.length} users created`);

        // Create items (5-10 items per user)
        let itemsToInsert = [];

        createdUsers.forEach(user => {
            const numItems = Math.floor(Math.random() * 6) + 5; // 5-10 items
            for (let i = 0; i < numItems; i++) {
                itemsToInsert.push(generateRandomItem(user._id));
            }
        });

        const createdItems = await Item.insertMany(itemsToInsert);
        console.log(`${createdItems.length} items created`);

        console.log('Data imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Delete data
const destroyData = async () => {
    try {
        await User.deleteMany();
        await Item.deleteMany();

        console.log('Data destroyed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}