const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

// ─── Simple In-Memory Cache ───────────────────────────────────────────────────
// Stats baar baar same hoti hain — DB ko hit karna waste hai
// 5 minute cache = 60x less DB queries (agar har second request aaye)
let statsCache = null;
let statsCacheTime = null;
const STATS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// @route  GET /api/stats  (public)
// @desc   Landing page ke liye real platform statistics
const getPlatformStats = async (req, res) => {
  try {
    // Cache hit check — agar fresh data hai toh DB pe jaana nahi
    if (statsCache && statsCacheTime && Date.now() - statsCacheTime < STATS_CACHE_TTL) {
      return res.json(statsCache);
    }

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

    const result = {
      totalEvents,
      totalGuests: totalTickets,   // tickets sold = guests served
      totalOrganizers: Math.max(
        await User.countDocuments({ role: "organizer" }),
        0
      ),
      avgRating,
    };

    // Cache store karo
    statsCache = result;
    statsCacheTime = Date.now();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Cache manually invalidate karne ka function (agar new event/ticket create ho)
const invalidateStatsCache = () => {
  statsCache = null;
  statsCacheTime = null;
};

module.exports = { getPlatformStats, invalidateStatsCache };
