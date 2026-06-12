const express = require("express");

const router = express.Router();

const {
    chat,
    roadmap
} = require("../controllers/aiController");

router.post("/chat", chat);

router.post("/roadmap", roadmap);

module.exports = router;