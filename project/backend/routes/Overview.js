const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const User = require("../models/User");

const Product = require("../models/Product");

router.get("/top-products", async (req, res) => {
    const { period } = req.query; // 'daily', 'weekly', 'monthly'

    if (!["daily", "weekly", "monthly"].includes(period)) {
        return res
            .status(400)
            .json({ error: "Invalid period. Use daily, weekly, or monthly." });
    }

    try {
        // Define date range based on the period
        const now = new Date();
        let startDate;
        if (period === "daily") {
            // Start of today
            startDate = new Date(now.setHours(0, 0, 0, 0));
        } else if (period === "weekly") {
            // Start of the last 7 days
            startDate = new Date(now.setDate(now.getDate() - 6));
            startDate.setHours(0, 0, 0, 0); // Reset to midnight
        } else if (period === "monthly") {
            // Start of the current month
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // Fetch and aggregate data
        const productPerformance = await Order.aggregate([
            // Filter orders created after startDate
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: "$orderItems" }, // Break orderItems into individual docs
            {
                $group: {
                    _id: "$orderItems.productId",
                    totalSold: { $sum: "$orderItems.quantity" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" }, // Extract product details
            {
                $project: {
                    productName: "$productDetails.name",
                    totalSold: 1,
                },
            },
            { $sort: { totalSold: -1 } }, // Sort by most sold
            {
                $group: {
                    _id: null,
                    products: {
                        $push: { productName: "$productName", totalSold: "$totalSold" },
                    },
                },
            },
        ]);

        res.status(200).json({
            data: productPerformance.length > 0 ? productPerformance[0].products : [],
        });
    } catch (error) {
        console.error("Error fetching product performance:", error);
        res.status(500).json({
            message: "Server error while fetching product performance",
        });
    }
});


router.get("/inventory-status", async (req, res) => {
    try {
        // Aggregate inventory data
        const inventoryStatus = await Inventory.aggregate([
            {
                $facet: {
                    available: [
                        { $match: { quantity: { $gt: 10 } } }, // Items with quantity > 10
                        { $count: "count" },
                    ],
                    lowStock: [
                        { $match: { quantity: { $gt: 0, $lte: 10 } } }, // Items with quantity between 1 and 10
                        { $count: "count" },
                    ],
                    outOfStock: [
                        { $match: { quantity: { $eq: 0 } } }, // Items with quantity = 0
                        { $count: "count" },
                    ],
                },
            },
        ]);

        // Format the response
        const response = {
            available: inventoryStatus[0]?.available[0]?.count || 0,
            lowStock: inventoryStatus[0]?.lowStock[0]?.count || 0,
            outOfStock: inventoryStatus[0]?.outOfStock[0]?.count || 0,
        };

        res.status(200).json({ data: response });
    } catch (error) {
        console.error("Error fetching inventory status:", error);
        res.status(500).json({ message: "Error fetching inventory status" });
    }
});

// Fetch recent activity
router.get("/recent-activity", async (req, res) => {
    try {
        // Fetch recent orders (limit 5)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("userId", "name email"); // Populate user details

        // Fetch recent users (limit 5)
        const newUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name email createdAt");

        // Fetch low stock alerts (quantity <= threshold)
        const lowStockAlerts = await Inventory.find({
            $expr: { $lte: ["$quantity", "$threshold"] },
        })
            .populate("productId", "name")
            .limit(5);

        res.status(200).json({
            data: {
                recentOrders,
                newUsers,
                lowStockAlerts,
            },
        });
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        res.status(500).json({ message: "Error fetching recent activity" });
    }
});
// Endpoint to get inventory status

module.exports = router;