const express = require("express");
const router = express.Router();

const {
    getAssignmentAnalytics
} = require("../controllers/assignmentAnalyticsController");

router.get(
    "/assignment-analytics",
    getAssignmentAnalytics
);

module.exports = router;