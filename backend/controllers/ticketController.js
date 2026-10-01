const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
// Stripe ko initialize karo — secret key .env se aayegi
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @route  POST /api/tickets (protected)
// @desc   Ticket purchase karo — payment verify karke hi ticket banega
const purchaseTicket = async (req, res) => {
  try {
    const { eventId, ticketType, quantity, paymentIntentId } = req.body;

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

    // --- Step 3: Stripe se payment VERIFY karo (most important step) ---
    // Hum Stripe ke server se puchh rahe hain: "Ye paymentIntentId valid hai?
    // Aur payment actually succeed hua?"
    // Client kabhi bhi fake paymentIntentId bhej sakta tha — ye check usse rokta hai
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: "Payment verification failed. Payment was not completed.",
      });
    }

    // --- Step 4: Ye bhi verify karo ki payment kisi aur ke account ke liye toh nahi ---
    // paymentIntent mein humne userId metadata store kiya tha (paymentRoutes.js mein)
    if (paymentIntent.metadata?.userId !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Payment intent does not belong to this user.",
      });
    }

    // --- Step 5: Duplicate ticket check — ek hi payment se 2 tickets na ban jayein ---
    const existingTicket = await Ticket.findOne({ paymentIntentId });
    if (existingTicket) {
      return res.status(409).json({
        message: "Ticket already issued for this payment.",
      });
    }

    // --- Step 6: totalAmount BACKEND mein calculate karo ---
    // Client ki totalAmount bilkul ignore — chahe koi 0 bheje, hum event ke real price se
    // calculate karenge. Ye price manipulation attack rokta hai.
    const totalAmount = Number((event.price * quantity).toFixed(2));

    // --- Step 7: Ticket create karo ---
    const ticket = await Ticket.create({
      event: eventId,
      user: req.user._id,
      ticketType,
      quantity,
      totalAmount,       // backend calculated ✅
      paymentIntentId,   // stored for records ✅
    });

    const populatedTicket = await ticket.populate(
      "event",
      "title previewImage venue startDate startTime"
    );

    res.status(201).json(populatedTicket);
  } catch (error) {
    // Mongoose duplicate key error (paymentIntentId unique constraint)
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

    const ticket = await Ticket.create({
      event: eventId,
      user: req.user._id,
      ticketType,
      quantity,
      totalAmount: 0,       // free hai
      isFreeTicket: true,   // flag set karo
      // paymentIntentId intentionally absent for free tickets
    });

    const populatedTicket = await ticket.populate(
      "event",
      "title previewImage venue startDate startTime"
    );

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/tickets/mine (protected)
// @desc   Logged-in user ke saare purchased tickets laao
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate("event", "title previewImage venue startDate startTime")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { purchaseTicket, registerFreeTicket, getMyTickets };
