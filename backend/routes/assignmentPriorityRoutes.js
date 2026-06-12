const express = require("express");
const router = express.Router();

const {
    getAssignmentPriority
} = require("../controllers/assignmentPriorityController");

router.post(
    "/assignment-priority",
    getAssignmentPriority
);

module.exports = router;