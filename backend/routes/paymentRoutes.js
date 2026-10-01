const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @route POST /api/payment/create-intent (protected)
// Creates a Stripe PaymentIntent — frontend uses this to show card form
router.post("/create-intent", protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents (e.g. $250 = 25000)

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
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
