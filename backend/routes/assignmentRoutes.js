const express = require("express");
const router = express.Router();

const {
    updateAssignment,
    deleteAssignment
} = require("../controllers/assignmentController");

router.put(
    "/assignments/:id",
    updateAssignment
);

module.exports = router;
router.delete(
    "/assignments/:id",
    deleteAssignment
);