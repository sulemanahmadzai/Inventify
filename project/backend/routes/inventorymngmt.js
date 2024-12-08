const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const inventoryController = require('../controllers/inventoryController');
const uploadFile = require('../middlewares/multer'); // Adjust the path as needed
const Inventory = require('../models/Inventory');
const upload = require('../middlewares/multerImage');
const Product = require('../models/Product'); // Assuming you have a Product model
const Category = require('../models/Category');



router.post('/add', upload.array('images', 5), inventoryController.addInventory);
router.put('/update/:id', inventoryController.updateInventory);
router.delete('/delete/:id', inventoryController.deleteInventory);
router.post('/upload-test', upload.array('images', 5), (req, res) => {
    res.status(200).json({ message: 'Upload successful', files: req.files });
});
router.post('/bulk-upload', uploadFile.single('file'), inventoryController.bulkUpload);
router.get('/check', inventoryController.checkStock);
/*
router.get('/', async (req, res) => {
    try {
        // Get pagination, sorting, and search parameters from the query
        const {
            page = 1,  // Current page (default to 1)
            limit = 15, // Items per page (default to 15)
            inventoryId = '', // Search by inventory ID
            productName = '', // Search by product name
            category = '', // Search by category name
            quantity = '', // Search by quantity
        } = req.query;

        // Convert pagination parameters to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Calculate skip value (skip = (page - 1) * limit)
        const skip = (pageNumber - 1) * limitNumber;

        // Initialize the query object for search filters
        let query = {};

        // Search by inventoryId (if provided)
        if (inventoryId) {
            query._id = inventoryId; // Match by Inventory ID
        }

        // Search by product name (if provided)
        if (productName) {
            const products = await Product.find({ name: new RegExp(productName, 'i') }).select('_id');
            if (products.length > 0) {
                const productIds = products.map(product => product._id);
                query.productId = { $in: productIds }; // Filter inventory by matching product IDs
            } else {
                query.productId = null; // No matching products found
            }
        }

        // Search by category (if provided)
        if (category) {
            const categories = await Category.find({ name: new RegExp(category, 'i') }).select('_id');
            if (categories.length > 0) {
                const categoryIds = categories.map(category => category._id);
                const products = await Product.find({ categories: { $in: categoryIds } }).select('_id');
                if (products.length > 0) {
                    const productIds = products.map(product => product._id);
                    query.productId = { $in: productIds }; // Filter inventory by matching product IDs
                } else {
                    query.productId = null; // No matching products found
                }
            }
        }

        // Search by quantity (if provided)
        if (quantity) {
            query.quantity = quantity; // Match by exact quantity
        }

        // Find inventory items with pagination and search filters
        const inventoryItems = await Inventory.find(query)
            .populate({
                path: 'productId',
                select: 'name description price images categories attributes tags',
                populate: {
                    path: 'categories',
                    select: 'name', // Only select the category name
                },
            })
            .select('quantity expirationDate threshold location') // Select necessary fields from Inventory
            .skip(skip)        // Skip the records based on the page
            .limit(limitNumber); // Limit the number of records to the `limit`

        // Get the total number of inventory items for pagination metadata
        const totalItems = await Inventory.countDocuments(query);

        // Format the data to include the required fields
        const formattedInventory = inventoryItems.map(item => {
            if (!item.productId) {
                return null;
            }

            const productName = item.productId.name || 'Unknown';
            const productDescription = item.productId.description || 'No description available';
            const productPrice = item.productId.price || 0;
            const productImages = item.productId.images || [];
            const productThreshold = item.threshold || 0;
            const categories = item.productId.categories ? item.productId.categories.map(category => category.name) : [];
            const tags = item.productId.tags || [];
            const attributes = item.productId.attributes
                ? Object.entries(item.productId.attributes).map(([key, value]) => ({ key, value }))
                : [];

            return {
                inventoryId: item._id,
                productName,
                description: productDescription,
                price: productPrice,
                images: productImages,
                categories,
                threshold: productThreshold,
                attributes,
                tags,
                quantity: item.quantity,
                location: item.location,
                expirationDate: item.expirationDate,
            };
        }).filter(item => item !== null);

        // Pagination metadata
        const totalPages = Math.ceil(totalItems / limitNumber); // Calculate total number of pages

        // Return paginated data along with pagination metadata
        res.status(200).json({
            data: formattedInventory,
            pagination: {
                totalItems,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
*/

router.get('/', async (req, res) => {
    try {
        // Get pagination, sorting, and search parameters from the query
        const {
            page = 1,  // Current page (default to 1)
            limit = 15, // Items per page (default to 15)
            inventoryId = '', // Search by inventory ID
            productName = '', // Search by product name
            category = '', // Search by category name
            quantity = '', // Search by quantity
            sortBy = '', // Sort by field (quantity, threshold, expirationDate)
            sortOrder = 'asc', // Sort order (asc or desc)
        } = req.query;

        // Convert pagination parameters to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Calculate skip value (skip = (page - 1) * limit)
        const skip = (pageNumber - 1) * limitNumber;

        // Initialize the query object for search filters
        let query = {};

        // Search by inventoryId (if provided)
        if (inventoryId) {
            query._id = inventoryId; // Match by Inventory ID
        }

        // Search by product name (if provided)
        if (productName) {
            const products = await Product.find({ name: new RegExp(productName, 'i') }).select('_id');
            if (products.length > 0) {
                const productIds = products.map(product => product._id);
                query.productId = { $in: productIds }; // Filter inventory by matching product IDs
            } else {
                query.productId = null; // No matching products found
            }
        }

        // Search by category (if provided)
        if (category) {
            const categories = await Category.find({ name: new RegExp(category, 'i') }).select('_id');
            if (categories.length > 0) {
                const categoryIds = categories.map(category => category._id);
                const products = await Product.find({ categories: { $in: categoryIds } }).select('_id');
                if (products.length > 0) {
                    const productIds = products.map(product => product._id);
                    query.productId = { $in: productIds }; // Filter inventory by matching product IDs
                } else {
                    query.productId = null; // No matching products found
                }
            }
        }

        // Search by quantity (if provided)
        if (quantity) {
            query.quantity = quantity; // Match by exact quantity
        }

        // Construct the sorting object
        let sort = {};

        if (sortBy && ['quantity', 'threshold', 'expirationDate'].includes(sortBy)) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending
        }

        // Find inventory items with pagination, search filters, and sorting
        const inventoryItems = await Inventory.find(query)
            .populate({
                path: 'productId',
                select: 'name description price images categories attributes tags',
                populate: {
                    path: 'categories',
                    select: 'name', // Only select the category name
                },
            })
            .select('quantity expirationDate threshold location') // Select necessary fields from Inventory
            .skip(skip)        // Skip the records based on the page
            .limit(limitNumber) // Limit the number of records to the `limit`
            .sort(sort); // Apply sorting

        // Get the total number of inventory items for pagination metadata
        const totalItems = await Inventory.countDocuments(query);

        // Format the data to include the required fields
        const formattedInventory = inventoryItems.map(item => {
            if (!item.productId) {
                return null;
            }

            const productName = item.productId.name || 'Unknown';
            const productDescription = item.productId.description || 'No description available';
            const productPrice = item.productId.price || 0;
            const productImages = item.productId.images || [];
            const productThreshold = item.threshold || 0;
            const categories = item.productId.categories ? item.productId.categories.map(category => category.name) : [];
            const tags = item.productId.tags || [];
            const attributes = item.productId.attributes
                ? Object.entries(item.productId.attributes).map(([key, value]) => ({ key, value }))
                : [];

            return {
                inventoryId: item._id,
                productName,
                description: productDescription,
                price: productPrice,
                images: productImages,
                categories,
                threshold: productThreshold,
                attributes,
                tags,
                quantity: item.quantity,
                location: item.location,
                expirationDate: item.expirationDate,
            };
        }).filter(item => item !== null);

        // Pagination metadata
        const totalPages = Math.ceil(totalItems / limitNumber); // Calculate total number of pages

        // Return paginated data along with pagination metadata
        res.status(200).json({
            data: formattedInventory,
            pagination: {
                totalItems,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});






module.exports = router;
