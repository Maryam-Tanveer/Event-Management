const express = require("express");
const router = express.Router();
const { getReviews, createReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

// GET  /api/reviews/:eventId  — public, koi bhi dekh sakta hai
router.get("/:eventId", getReviews);

// POST /api/reviews/:eventId  — sirf logged-in users
router.post("/:eventId", protect, createReview);

module.exports = router;
