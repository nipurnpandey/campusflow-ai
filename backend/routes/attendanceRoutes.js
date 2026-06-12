const express = require("express");

const router = express.Router();

const {
    getAttendance,
    createAttendance
} = require("../controllers/attendanceController");

router.get("/attendance", getAttendance);

router.post("/attendance", createAttendance);

module.exports = router;