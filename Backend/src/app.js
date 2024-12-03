// src/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const Overview = require("./routes/OverviewRoutes");
const userRoutes = require("./routes/userRoutes");
const saleRoutes = require("./routes/saleRoutes");
const app = express();
const analyticsRoutes = require("./routes/analyticsRoutes");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/overview", Overview);
app.use("/api/users", userRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/analytics", analyticsRoutes);

module.exports = app;
