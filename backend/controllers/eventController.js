const Event = require("../models/Event");
const mongoose = require("mongoose");

// Helper: User input ke regex special characters escape karo
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route POST /api/events (protected, organizer only)
const createEvent = async (req, res) => {
  try {
    const {
      title, synopsis, category, price, tags,
      startDate, startTime, endDate, endTime,
      timezone, format, venue, address, streamUrl,
      previewImage, galleryImages, selectedTier, tierDetails,
      agendaSlots, guests, amenities, maxTickets,
      promoVideo, privacy,
    } = req.body;

    if (!title?.trim())   return res.status(400).json({ message: "Event title is required." });
    if (!synopsis?.trim()) return res.status(400).json({ message: "Synopsis is required." });
    if (!venue?.trim())   return res.status(400).json({ message: "Venue is required." });
    if (!startDate?.trim()) return res.status(400).json({ message: "Start date is required." });
    if (price !== undefined && Number(price) < 0)
      return res.status(400).json({ message: "Price cannot be negative." });

    const event = await Event.create({
      title: title.trim(),
      synopsis: synopsis.trim(),
      category: category || "All Events",
      price: price !== undefined ? Number(price) : 0,
      tags: Array.isArray(tags) ? tags : [],
      startDate, startTime, endDate, endTime, timezone, format,
      venue: venue.trim(), address, streamUrl,
      previewImage,
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      selectedTier, tierDetails,
      // ✅ New dynamic fields
      agendaSlots: Array.isArray(agendaSlots) ? agendaSlots : [],
      guests: Array.isArray(guests) ? guests : [],
      amenities: Array.isArray(amenities) ? amenities : [],
      maxTickets: maxTickets ? Number(maxTickets) : null,
      promoVideo,
      privacy: privacy || "Public",
      organizer: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/events  (public)
// Supports: ?featured=true  for landing page featured events
const getEvents = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip  = (page - 1) * limit;

    const filter = {};

    // ✅ Featured filter — Landing Page ke liye
    if (req.query.featured === "true") {
      filter.isFeatured = true;
    }

    if (req.query.category && req.query.category !== "All Events") {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      const rawSearch = req.query.search.trim();
      if (rawSearch.length > 100)
        return res.status(400).json({ message: "Search query too long (max 100 characters)." });
      const safeSearch = escapeRegex(rawSearch);
      filter.$or = [
        { title:    { $regex: safeSearch, $options: "i" } },
        { venue:    { $regex: safeSearch, $options: "i" } },
        { synopsis: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (req.query.priceMin !== undefined || req.query.priceMax !== undefined) {
      filter.price = {};
      if (req.query.priceMin) filter.price.$gte = Number(req.query.priceMin);
      if (req.query.priceMax) filter.price.$lte = Number(req.query.priceMax);
    }

    let sortOption = { createdAt: -1 };
    if (req.query.sortBy === "priceLow")   sortOption = { price: 1 };
    if (req.query.sortBy === "priceHigh")  sortOption = { price: -1 };
    if (req.query.sortBy === "rating")     sortOption = { avgRating: -1 };
    if (req.query.sortBy === "popular")    sortOption = { reviewCount: -1 };

    const totalCount = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .populate("organizer", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      events,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasMore: page * limit < totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/events/categories  (public)
// ✅ Sidebar ke liye DB se distinct categories
const getCategories = async (req, res) => {
  try {
    const categories = await Event.distinct("category");
    // "All Events" ko pehle rakho
    const sorted = ["All Events", ...categories.filter((c) => c && c !== "All Events").sort()];
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/events/:id  (public)
const getEventById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid event ID format." });

    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/events/mine/all  (protected — organizer)
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/events/:id  (protected, organizer only)
const updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid event ID format." });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });

    if (event.organizer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized. You can only edit your own events." });

    const {
      title, synopsis, category, price, tags,
      startDate, startTime, endDate, endTime,
      timezone, format, venue, address, streamUrl,
      previewImage, galleryImages, selectedTier, tierDetails,
      agendaSlots, guests, amenities, maxTickets,
      promoVideo, privacy,
    } = req.body;

    if (title !== undefined && !title?.trim())
      return res.status(400).json({ message: "Event title cannot be empty." });
    if (price !== undefined && Number(price) < 0)
      return res.status(400).json({ message: "Price cannot be negative." });

    const u = {};
    if (title       !== undefined) u.title       = title.trim();
    if (synopsis    !== undefined) u.synopsis    = synopsis.trim();
    if (category    !== undefined) u.category    = category;
    if (price       !== undefined) u.price       = Number(price);
    if (tags        !== undefined) u.tags        = Array.isArray(tags) ? tags : [];
    if (startDate   !== undefined) u.startDate   = startDate;
    if (startTime   !== undefined) u.startTime   = startTime;
    if (endDate     !== undefined) u.endDate     = endDate;
    if (endTime     !== undefined) u.endTime     = endTime;
    if (timezone    !== undefined) u.timezone    = timezone;
    if (format      !== undefined) u.format      = format;
    if (venue       !== undefined) u.venue       = venue.trim();
    if (address     !== undefined) u.address     = address;
    if (streamUrl   !== undefined) u.streamUrl   = streamUrl;
    if (previewImage  !== undefined) u.previewImage  = previewImage;
    if (galleryImages !== undefined) u.galleryImages = Array.isArray(galleryImages) ? galleryImages : [];
    if (selectedTier !== undefined) u.selectedTier = selectedTier;
    if (tierDetails  !== undefined) u.tierDetails  = tierDetails;
    // ✅ New dynamic fields
    if (agendaSlots !== undefined) u.agendaSlots = Array.isArray(agendaSlots) ? agendaSlots : [];
    if (guests      !== undefined) u.guests      = Array.isArray(guests) ? guests : [];
    if (amenities   !== undefined) u.amenities   = Array.isArray(amenities) ? amenities : [];
    if (maxTickets  !== undefined) u.maxTickets  = maxTickets ? Number(maxTickets) : null;
    if (promoVideo  !== undefined) u.promoVideo  = promoVideo;
    if (privacy     !== undefined) u.privacy     = privacy;

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: u },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /api/events/:id  (protected, organizer only)
const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid event ID format." });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });

    if (event.organizer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized. You can only delete your own events." });

    await event.deleteOne();
    res.json({ message: "Event deleted successfully.", deletedId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEvent, getEvents, getEventById,
  getMyEvents, updateEvent, deleteEvent, getCategories,
};