const express = require("express");
const router = express.Router();

const {
    getAiHistory
} = require("../controllers/aiHistoryController");

router.get(
    "/ai-history",
    getAiHistory
);

module.exports = router;