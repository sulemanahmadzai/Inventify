const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Add a new category
router.post('/add', categoryController.addCategory);

// Update an existing category
router.put('/update/:id', categoryController.updateCategory);

// Delete a category
router.delete('/delete/:id', categoryController.deleteCategory);

// View all categories
router.get('/', categoryController.viewAllCategories);

module.exports = router;
