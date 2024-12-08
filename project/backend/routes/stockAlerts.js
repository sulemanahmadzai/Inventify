const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const StockAlert = require('../models/StockAlert');
const upload = require('../middlewares/multerImage');
const Product = require('../models/Product'); // Assuming you have a Product model
const Category = require('../models/Category');
const { sendAlertsToManagers } = require('../controllers/stockAlertController');


// GET /stock-alerts
/*
router.get('/', async (req, res) => {
    try {
        const { type } = req.query; // Optional filter by alert type

        const query = {};
        if (type) query.type = type;

        const stockAlerts = await StockAlert.find(query)
            .populate({
                path: 'inventoryItemId',
                select: 'productId quantity location expirationDate', // Select fields from Inventory
                populate: {
                    path: 'productId',
                    select: 'name', // Select product name from Product
                }
            })
            .sort({ createdAt: -1 }); // Sort by newest first

        // Format the data to include the required fields
        const formattedAlerts = stockAlerts.map(alert => {
            if (!alert.inventoryItemId || !alert.inventoryItemId.productId) {
                return null;
            }

            return {
                alertMessage: alert.message,   // The alert message
                alertType: alert.type,         // The type of the alert (low_stock, out_of_stock, etc.)
                inventoryId: alert.inventoryItemId._id,  // Inventory ID
                productName: alert.inventoryItemId.productId.name,  // Product name
                quantity: alert.inventoryItemId.quantity,  // Quantity of the inventory item
                location: alert.inventoryItemId.location,  // Location of the inventory item
                expirationDate: alert.inventoryItemId.expirationDate,  // Expiration date
            };
        }).filter(item => item !== null); // Filter out any null values (if product is missing)

        res.status(200).json({ stockAlerts: formattedAlerts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
*/

router.get('/', async (req, res) => {
    try {
        const { type, page = 1, limit = 10 } = req.query; // Optional filter by alert type, default page = 1, default limit = 10

        // Parse page and limit as integers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const query = {};
        if (type) query.type = type;

        // Find the alerts with pagination
        const stockAlerts = await StockAlert.find(query)
            .populate({
                path: 'inventoryItemId',
                select: 'productId quantity location expirationDate', // Select fields from Inventory
                populate: {
                    path: 'productId',
                    select: 'name', // Select product name from Product
                }
            })
            .sort({ createdAt: -1 })  // Sort by newest first
            .skip((pageNum - 1) * limitNum)  // Skip based on the current page
            .limit(limitNum);  // Limit the number of results based on the provided limit

        // Format the data to include the required fields and trim the expiration date
        const formattedAlerts = stockAlerts.map(alert => {
            if (!alert.inventoryItemId || !alert.inventoryItemId.productId) {
                return null;
            }

            // Trim expiration date to day, month, and year
            const expirationDate = alert.inventoryItemId.expirationDate
                ? new Date(alert.inventoryItemId.expirationDate).toISOString().split('T')[0] // Format to YYYY-MM-DD
                : null;

            return {
                alertMessage: alert.message,   // The alert message
                alertType: alert.type,         // The type of the alert (low_stock, out_of_stock, etc.)
                inventoryId: alert.inventoryItemId._id,  // Inventory ID
                productName: alert.inventoryItemId.productId.name,  // Product name
                quantity: alert.inventoryItemId.quantity,  // Quantity of the inventory item
                location: alert.inventoryItemId.location,  // Location of the inventory item
                expirationDate: expirationDate,  // Trimmed expiration date (YYYY-MM-DD)
            };
        }).filter(item => item !== null); // Filter out any null values (if product is missing)

        // Get the total count of the filtered stock alerts
        const totalAlerts = await StockAlert.countDocuments(query);

        // Prepare pagination information
        const totalPages = Math.ceil(totalAlerts / limitNum);

        res.status(200).json({
            stockAlerts: formattedAlerts,
            pagination: {
                currentPage: pageNum,
                totalPages: totalPages,
                totalAlerts: totalAlerts,
                limit: limitNum,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/sendEmailsToManager', async (req, res) => {
    try {
        await sendAlertsToManagers();
        res.status(200).json({ message: 'Stock alerts sent to all managers' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending stock alerts', error: error.message });
    }
});

module.exports = router;

