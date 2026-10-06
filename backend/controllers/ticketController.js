const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
// Stripe ko initialize karo — fallback placeholder avoids process crash during tests
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

const PROMO_RATES = {
  LUXE10: 0.10,
  GALA20: 0.20,
  WELCOME: 0.15,
};

// @route  POST /api/tickets (protected)
// @desc   Ticket purchase karo — payment verify karke hi ticket banega
const purchaseTicket = async (req, res) => {
  try {
    const { eventId, ticketType, quantity, paymentIntentId, promoCode } = req.body;

    // --- Step 1: Basic input validation ---
    if (!eventId || !ticketType || !quantity || !paymentIntentId) {
      return res.status(400).json({
        message: "Missing required fields: eventId, ticketType, quantity, paymentIntentId",
      });
    }

    if (quantity < 1 || quantity > 10) {
      return res.status(400).json({ message: "Quantity must be between 1 and 10" });
    }

    // --- Step 2: Event exist karta hai ya nahi DB mein check karo ---
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // --- Step 3: Stripe se payment VERIFY karo ---
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: "Payment verification failed. Payment was not completed.",
      });
    }

    // --- Step 4: Verify payment intent user ---
    if (paymentIntent.metadata?.userId !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Payment intent does not belong to this user.",
      });
    }

    // --- Step 5: Duplicate ticket check ---
    const existingTicket = await Ticket.findOne({ paymentIntentId });
    if (existingTicket) {
      return res.status(409).json({
        message: "Ticket already issued for this payment.",
      });
    }

    // --- Step 6: Pricing calculation with VIP and Promo Code support ---
    const isVip = ticketType.toLowerCase().includes("vip");
    const unitPrice = isVip
      ? Math.round(event.price * 1.8 * 100) / 100
      : Number(event.price) || 0;
    const subtotal = Number((unitPrice * quantity).toFixed(2));

    let discountAmount = 0;
    let appliedPromo = null;
    if (promoCode && typeof promoCode === "string") {
      const normalizedCode = promoCode.trim().toUpperCase();
      const rate = PROMO_RATES[normalizedCode] || 0;
      if (rate > 0) {
        appliedPromo = normalizedCode;
        discountAmount = Number((subtotal * rate).toFixed(2));
      }
    }

    const totalAmount = Math.max(0, Number((subtotal - discountAmount).toFixed(2)));

    // --- Step 7: Ticket create karo ---
    const ticket = await Ticket.create({
      event: eventId,
      user: req.user._id,
      ticketType,
      quantity,
      totalAmount,
      discountAmount,
      promoCode: appliedPromo,
      paymentIntentId,
    });

    const populatedTicket = await ticket.populate(
      "event",
      "title previewImage venue startDate startTime city coordinates"
    );

    res.status(201).json(populatedTicket);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Ticket already issued for this payment." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/tickets/free (protected)
// @desc   Free event registration — no payment needed, but validate event is actually free
const registerFreeTicket = async (req, res) => {
  try {
    const { eventId, ticketType, quantity } = req.body;

    if (!eventId || !ticketType || !quantity) {
      return res.status(400).json({ message: "Missing required fields: eventId, ticketType, quantity" });
    }

    if (quantity < 1 || quantity > 10) {
      return res.status(400).json({ message: "Quantity must be between 1 and 10" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Security check: sirf actually free events ke liye hi ye route kaam kare
    // Agar event paid hai aur koi /tickets/free call kare — block karo
    if (event.price > 0) {
      return res.status(400).json({
        message: "This event is not free. Please use the payment flow.",
      });
    }

    // Duplicate registration check — ek user ek free event ke liye ek baar hi register kare
    const alreadyRegistered = await Ticket.findOne({ event: eventId, user: req.user._id });
    if (alreadyRegistered) {
      return res.status(409).json({ message: "You are already registered for this event." });
    }

    const freeRef = `free_${Date.now()}_${req.user._id}_${Math.random().toString(36).substring(2, 8)}`;

    const ticket = await Ticket.create({
      event: eventId,
      user: req.user._id,
      ticketType,
      quantity,
      totalAmount: 0,       // free hai
      isFreeTicket: true,   // flag set karo
      paymentIntentId: freeRef, // unique reference to prevent null-index collisions
    });

    const populatedTicket = await ticket.populate(
      "event",
      "title previewImage venue address city coordinates startDate startTime"
    );

    res.status(201).json(populatedTicket);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You are already registered for this event." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/tickets/mine (protected)
// @desc   Logged-in user ke saare purchased tickets laao
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate("event", "title previewImage venue address city coordinates startDate startTime")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { purchaseTicket, registerFreeTicket, getMyTickets };
