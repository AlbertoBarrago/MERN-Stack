const express = require('express');
const router = express.Router();
const {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getItems);
router.get('/:id', getItem);

// Protected routes
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;