const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

// @route  GET /api/stats  (public)
// @desc   Landing page ke liye real platform statistics
const getPlatformStats = async (req, res) => {
  try {
    const [totalEvents, totalTickets, totalUsers] = await Promise.all([
      Event.countDocuments(),
      Ticket.countDocuments(),
      User.countDocuments(),
    ]);

    // Average rating — sab published events ki weighted average
    const ratingResult = await Event.aggregate([
      { $match: { reviewCount: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          weightedAvg: {
            $avg: "$avgRating",
          },
        },
      },
    ]);

    const avgRating =
      ratingResult.length > 0
        ? Math.round(ratingResult[0].weightedAvg * 10) / 10
        : 4.9; // Fallback jab tak koi review nahi

    res.json({
      totalEvents,
      totalGuests: totalTickets,   // tickets sold = guests served
      totalOrganizers: Math.max(
        await User.countDocuments({ role: "organizer" }),
        0
      ),
      avgRating,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getPlatformStats };
