const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order'); // Import the Order model
const router = express.Router();
const sendGridHelper = require('../utils/emailHelper');

// Middleware for parsing JSON
router.use(express.json());



// 1. View all orders or orders filtered by status with pagination
router.get('/', async (req, res) => {
    const { status, userId, page = 1, limit = 10 } = req.query; // Default page=1, limit=10

    try {
        const query = {};
        if (status) query.status = status; // Filter by status
        if (userId) query.userId = userId; // Filter by userId (user-specific view)

        // Parse page and limit as integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch orders with pagination
        const orders = await Order.find(query)
            .populate('userId') // Populate user details
            .skip(skip) // Skip records for pagination
            .limit(limitNumber) // Limit records per page
            .exec();

        // Total count for all records matching the query
        const totalOrders = await Order.countDocuments(query);

        // Sending response with pagination info
        res.status(200).json({
            orders,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalOrders / limitNumber),
            totalOrders,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});


// 2. View a specific order by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('userId').exec();
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the order.' });
    }
});



// 3. Process an order (Update order status)
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status
    if (!['pending', 'shipped', 'delivered'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value. Must be one of: pending, shipped, or delivered.' });
    }

    try {
        const order = await Order.findById(id).populate('userId').exec();

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        // Check if the status is being changed in a valid direction
        if (order.status === 'delivered' && status !== 'delivered') {
            return res.status(400).json({ error: 'Cannot change status from "delivered".' });
        }
        if (order.status === 'shipped' && status === 'pending') {
            return res.status(400).json({ error: 'Cannot move status back to "pending" once shipped.' });
        }

        // Update the order's status
        order.status = status;

        // Save the updated order
        await order.save();

        // Send confirmation email to the user
        const emailContent = {
            subject: `Your order status has been updated to ${status}`,
            text: `Hello ${order.userId.name},\n\nYour order with ID ${order._id} has been updated to the status: ${status}.`,
            html: `
                <h3>Hello ${order.userId.name},</h3>
                <p>Your order with ID <strong>${order._id}</strong> has been updated to the status: <strong>${status}</strong>.</p>
                <p>Thank you for shopping with us!</p>
            `,
        };
        await sendGridHelper.sendEmail(order.userId.email, emailContent.subject, emailContent.html);

        // Send a success response with the updated order
        res.status(200).json({
            message: `Order status successfully updated to ${status}`,
            order: {
                _id: order._id,
                userId: order.userId,
                status: order.status,
                totalAmount: order.totalAmount,
                orderItems: order.orderItems,
            },
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status.' });
    }
});



// 4. Generate and download an invoice
const generateInvoice = (order) => {
    // Simple invoice template as an example
    return `
    Invoice for Order: ${order._id}
    ---------------------------------
    Date: ${order.createdAt}
    User ID: ${order.userId}

    Items:
    ${order.orderItems
            .map(
                (item) =>
                    `${item.productName} - Quantity: ${item.quantity}, Price: $${item.price}`
            )
            .join('\n')}

    Total Amount: $${order.totalAmount}

    Status: ${order.status}
    ---------------------------------
    Thank you for your purchase!
    `;
};

router.get('/:id/invoice', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('userId').exec();
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const invoice = generateInvoice(order);
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=invoice_${id}.txt`
        );
        res.status(200).send(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate invoice.' });
    }
});

// 5. Search orders by ID
router.get('/search/:id', async (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Order ID is required.' });
    }

    try {
        // Log the ID to check if it’s being passed correctly

        // Search for the order by its ID
        const order = await Order.findById(id).populate('userId').exec();

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        // Total count for all records (only one order in this case)
        const totalOrders = 1;

        // Sending response with pagination info (though it's always one order in this case)
        res.status(200).json({
            orders: [order], // Return the order in an array
            currentPage: 1, // Always 1 because it's a single order
            totalPages: 1,  // Always 1 because it's a single order
            totalOrders,    // Always 1 because we're searching for a specific order
        });
    } catch (error) {
        console.error('Error fetching order:', error); // Log the error details
        res.status(500).json({ error: 'Failed to search for the order. ' + error.message });
    }
});




// Export the router
module.exports = router;
