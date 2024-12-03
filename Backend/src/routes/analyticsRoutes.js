const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

// Key Metrics Endpoint
router.get("/metrics", async (req, res) => {
  try {
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const weeklySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      dailySales: dailySales[0]?.total || 0,
      weeklySales: weeklySales[0]?.total || 0,
      monthlySales: monthlySales[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales Trends Endpoint
router.get("/sales-trends", async (req, res) => {
  try {
    const salesTrends = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(salesTrends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stock Trends Endpoint
router.get("/stock-trends", async (req, res) => {
  try {
    const stockTrends = await Inventory.aggregate([
      {
        $group: {
          _id: "$productId",
          totalStock: { $sum: "$quantity" },
        },
      },
    ]);

    res.json(stockTrends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top Products Endpoint
router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          name: { $first: "$orderItems.productName" },
          totalSales: { $sum: "$orderItems.price" },
          totalQuantity: { $sum: "$orderItems.quantity" },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Alerts Endpoint
router.get("/alerts", async (req, res) => {
  try {
    const lowStockAlerts = await Inventory.find({ quantity: { $lt: 5 } })
      .populate("productId", "name")
      .lean();

    const alerts = lowStockAlerts.map((item) => ({
      message: `${item.productId.name} is running low on stock.`,
      type: "error",
    }));

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
