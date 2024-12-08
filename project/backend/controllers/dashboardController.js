const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

// Fetch Key Performance Indicators (KPIs)
exports.getKPIs = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        const totalOrders = await Order.countDocuments();
        const totalCostOfGoodsSold = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
                    },
                },
            },
        ]);
        const avgInventory = await Inventory.aggregate([
            { $group: { _id: null, avgQuantity: { $avg: "$quantity" } } },
        ]);

        const inventoryTurnover =
            totalCostOfGoodsSold[0]?.total && avgInventory[0]?.avgQuantity
                ? (totalCostOfGoodsSold[0].total / avgInventory[0].avgQuantity).toFixed(
                    2
                )
                : 0;

        res.status(200).json({
            totalUsers,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalOrders,
            inventoryTurnover,
        });
    } catch (error) {
        console.error("Error fetching KPIs:", error);
        res.status(500).json({ message: "Error fetching KPIs" });
    }
};

// Fetch Chart Data

exports.getCharts = async (req, res) => {
    try {
        // 1. Sales Trends
        const salesTrends = await Order.aggregate([
            { $match: { status: "delivered" } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } }, // Sort by date
        ]);

        // 2. Product Performance (Top-selling and slow-moving)
        const productPerformance = await Order.aggregate([
            // Step 1: Unwind the orderItems array to handle each item individually
            { $unwind: "$orderItems" },

            // Step 2: Group by productId to calculate total quantity sold for each product
            {
                $group: {
                    _id: "$orderItems.productId", // Group by the productId in orderItems
                    totalSold: { $sum: "$orderItems.quantity" }, // Sum up the quantities
                },
            },

            // Step 3: Lookup the corresponding product details from the Product collection
            {
                $lookup: {
                    from: "products", // The collection name for products
                    localField: "_id", // _id from the previous stage (productId)
                    foreignField: "_id", // _id in the Product collection
                    as: "productDetails", // Resulting array field with matched product details
                },
            },

            // Step 4: Unwind the productDetails array to make it a flat document
            { $unwind: "$productDetails" },

            // Step 5: Project the fields we need in the final result
            {
                $project: {
                    name: "$productDetails.name", // Get product name from productDetails
                    totalSold: 1, // Include totalSold from the grouping stage
                },
            },

            // Step 6: Sort by totalSold in descending order to get top-selling products
            { $sort: { totalSold: -1 } },
        ]);

        const topSelling = productPerformance.slice(0, 5); // Top 5 products
        const slowMoving = productPerformance.slice(-5); // Bottom 5 products

        // 3. Profit Margins
        const profitMargins = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$orderItems.price" },
                    cost: { $sum: { $multiply: ["$orderItems.quantity", 10] } }, // Assume cost per unit is 10
                },
            },
            {
                $project: {
                    profitMargin: {
                        $multiply: [
                            { $divide: [{ $subtract: ["$revenue", "$cost"] }, "$revenue"] },
                            100,
                        ],
                    },
                },
            },
        ]);

        // Response
        res.status(200).json({
            salesTrends,
            topSelling,
            slowMoving,

            profitMargin: profitMargins[0]?.profitMargin || 0,
        });
    } catch (error) {
        console.error("Error fetching charts:", error);
        res.status(500).json({ message: "Error fetching charts" });
    }
};

// Fetch Recent Activity
exports.getRecentActivity = async (req, res) => {
    try {
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
        const lowStockAlerts = await Inventory.find({ quantity: { $lt: 10 } });

        res.status(200).json({ recentUsers, recentOrders, lowStockAlerts });
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        res.status(500).json({ message: "Error fetching recent activity" });
    }
};