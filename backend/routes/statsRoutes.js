const express = require("express");
const router = express.Router();
const { getPlatformStats } = require("../controllers/statsController");

// GET /api/stats — public
router.get("/", getPlatformStats);

module.exports = router;
