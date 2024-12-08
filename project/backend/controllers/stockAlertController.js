const StockAlert = require('../models/StockAlert');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const sendGridHelper = require('../utils/emailHelper');

// Fetch and send alerts to all managers
exports.sendAlertsToManagers = async () => {
    try {
        const managers = await User.find({ role: 'manager' });

        if (!managers || managers.length === 0) {
            throw new Error('No managers found');
        }

        const stockAlerts = await StockAlert.find({}).populate({
            path: 'inventoryItemId',
            select: 'productId quantity expirationDate location',
            populate: { path: 'productId', select: 'name' },
        });

        if (!stockAlerts || stockAlerts.length === 0) {
            throw new Error('No stock alerts found');
        }

        // Format the stock alert details into HTML
        const alertDetails = stockAlerts.map(alert => {
            const inventory = alert.inventoryItemId;
            const product = inventory.productId;
            const expirationDate = inventory.expirationDate
                ? new Date(inventory.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : 'N/A';

            return `
                <h3>Alert Type: ${alert.type}</h3>
                <p><strong>Message:</strong> ${alert.message}</p>
                <p><strong>Inventory ID:</strong> ${inventory._id}</p>
                <p><strong>Product:</strong> ${product.name}</p>
                <p><strong>Quantity:</strong> ${inventory.quantity}</p>
                <p><strong>Expiration Date:</strong> ${expirationDate}</p>
                <hr>
            `;
        }).join('');

        // Send email to each manager
        for (const manager of managers) {
            const emailContent = sendGridHelper.createEmailContent(alertDetails);
            await sendGridHelper.sendEmail(manager.email, 'Stock Alerts Notification', emailContent);
        }

        console.log('Alerts sent to all managers');
    } catch (error) {
        console.error('Error in sending alerts:', error);
        throw new Error('Failed to send alerts to managers');
    }
};
