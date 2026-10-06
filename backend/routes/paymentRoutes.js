const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

// @route POST /api/payment/create-intent (protected)
// Creates a Stripe PaymentIntent for frontend card checkout
router.post("/create-intent", protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in dollars (e.g. $250)

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: "Stripe secret key is not configured on the server." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: "usd",
      metadata: { userId: req.user._id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: "Payment error", error: error.message });
  }
});

module.exports = router;
