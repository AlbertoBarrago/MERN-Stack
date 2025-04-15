const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: [0, 'Price cannot be negative'],
        },
        quantity: {
            type: Number,
            required: [true, 'Please add a quantity'],
            min: [0, 'Quantity cannot be negative'],
            default: 1,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Item', itemSchema);