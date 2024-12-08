const express = require("express");
const router = express.Router();
const {
    getKPIs,
    getCharts,
    getRecentActivity,
} = require("../controllers/dashboardController.js");

// Route for KPIs
router.get("/kpis", getKPIs);

// Route for Charts
router.get("/charts", getCharts);

// Route for Recent Activity
router.get("/recent-activity", getRecentActivity);

module.exports = router;