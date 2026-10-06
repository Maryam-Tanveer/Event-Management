const { Subscriber, Inquiry } = require("../models/Newsletter");

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe an email for early access and invitations
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email format." });
    }

    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(200).json({
        message: "You are already subscribed to LuxeEvents early access invitations!",
      });
    }

    await Subscriber.create({ email: cleanEmail });
    res.status(201).json({
      message: "Thank you for subscribing! You are now on the LuxeEvents private invitation list.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        message: "You are already subscribed to LuxeEvents early access invitations!",
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/newsletter/contact
// @desc    Submit a contact inquiry
const submitInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email format." });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: cleanEmail,
      subject: subject?.trim() || "General Concierge Inquiry",
      message: message.trim(),
    });

    res.status(201).json({
      message: "Your inquiry has been received. Our concierge team will reach out within 24 hours.",
      inquiryId: inquiry._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { subscribe, submitInquiry };
