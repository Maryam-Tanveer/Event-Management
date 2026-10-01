const express = require("express");
const router = express.Router();
const { validatePromoCode } = require("../controllers/promoController");
const { protect } = require("../middleware/auth");

// Protected — sirf logged-in users promo code validate kar sakein
// Kyun? Anonymous users promo codes brute-force kar sakte the
router.post("/validate", protect, validatePromoCode);

module.exports = router;
