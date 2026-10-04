const Review = require("../models/Review");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

// ─── Helper: Event ki avgRating aur reviewCount update karo ──────────────────
const updateEventRating = async (eventId) => {
  const result = await Review.aggregate([
    { $match: { event: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: "$event",
        avgRating:   { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Event.findByIdAndUpdate(eventId, {
      avgRating:   Math.round(result[0].avgRating * 10) / 10, // 1 decimal
      reviewCount: result[0].reviewCount,
    });
  } else {
    await Event.findByIdAndUpdate(eventId, { avgRating: 0, reviewCount: 0 });
  }
};

// @route  GET /api/reviews/:eventId  (public)
// @desc   Kisi event ke saare reviews fetch karo
const getReviews = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID." });
    }

    const reviews = await Review.find({ event: eventId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/reviews/:eventId  (protected)
// @desc   Review submit karo — sirf ticket holders kar sakte hain
const createReview = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID." });
    }

    if (!rating || !comment?.trim()) {
      return res.status(400).json({ message: "Rating and comment are required." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    // Duplicate check — ek user ek event ke liye ek review
    const existing = await Review.findOne({ event: eventId, user: req.user._id });
    if (existing) {
      return res.status(409).json({ message: "You have already reviewed this event." });
    }

    // Ticket verify karo — sirf attendees review kar sakein
    const ticket = await Ticket.findOne({ event: eventId, user: req.user._id });
    const isVerifiedAttendee = !!ticket;

    const review = await Review.create({
      event:   eventId,
      user:    req.user._id,
      rating:  Number(rating),
      comment: comment.trim(),
      isVerifiedAttendee,
    });

    // Event ki average rating update karo
    await updateEventRating(eventId);

    const populated = await review.populate("user", "name");
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already reviewed this event." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getReviews, createReview };
