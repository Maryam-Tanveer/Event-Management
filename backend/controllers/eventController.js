const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

// Helper: User input ke regex special characters escape karo
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route POST /api/events (protected, organizer only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      synopsis,
      category,
      price,
      tags,
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
      format,
      venue,
      address,
      city,
      coordinates,
      streamUrl,
      previewImage,
      galleryImages,
      selectedTier,
      tierDetails,
      agenda,
      promoVideo,
      privacy,
    } = req.body;

    // Required fields manually validate karo — clear error messages ke liye
    if (!title?.trim()) {
      return res.status(400).json({ message: "Event title is required." });
    }
    if (!synopsis?.trim()) {
      return res.status(400).json({ message: "Synopsis is required." });
    }
    if (!venue?.trim()) {
      return res.status(400).json({ message: "Venue is required." });
    }
    if (!startDate?.trim()) {
      return res.status(400).json({ message: "Start date is required." });
    }

    // Price negative nahi ho sakta
    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    const event = await Event.create({
      title: title.trim(),
      synopsis: synopsis.trim(),
      category: category || "All Events",
      price: price !== undefined ? Number(price) : 0,
      tags: Array.isArray(tags) ? tags : [],
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
      format,
      venue: venue.trim(),
      address,
      city: city?.trim() || "",
      coordinates: coordinates && typeof coordinates === "object" ? {
        lat: Number(coordinates.lat) || 0,
        lng: Number(coordinates.lng) || 0,
      } : undefined,
      streamUrl,
      previewImage,
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      // qualityScore is intentionally NOT accepted from client — server controls it
      selectedTier,
      tierDetails,
      agenda,
      promoVideo,
      privacy: privacy || "Public",
      organizer: req.user._id, // ✅ always set from authenticated user — client can never override this
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/events?page=1&limit=9&category=&search=&priceMin=&priceMax= (public)
const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Build dynamic filter
    const filter = {};

    if (req.query.category && req.query.category !== "All Events") {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      // ❌ Pehle tha: req.query.search directly regex mein — ReDoS attack possible tha
      // ✅ Ab:
      // 1. Length limit — 100 chars se zyada search ka koi matlab nahi
      // 2. escapeRegex — special chars neutralize karo taaki catastrophic backtracking na ho
      const rawSearch = req.query.search.trim();

      if (rawSearch.length > 100) {
        return res.status(400).json({ message: "Search query too long (max 100 characters)." });
      }

      const safeSearch = escapeRegex(rawSearch); // e.g. "(a+)+" → "\(a\+\)\+"

      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { venue: { $regex: safeSearch, $options: "i" } },
        { synopsis: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (req.query.location && req.query.location.trim()) {
      const safeLoc = escapeRegex(req.query.location.trim().slice(0, 100));
      const locCondition = [
        { venue: { $regex: safeLoc, $options: "i" } },
        { address: { $regex: safeLoc, $options: "i" } },
        { city: { $regex: safeLoc, $options: "i" } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: locCondition }];
        delete filter.$or;
      } else {
        filter.$or = locCondition;
      }
    }

    if (req.query.date && req.query.date.trim()) {
      const safeDate = escapeRegex(req.query.date.trim().slice(0, 50));
      filter.startDate = { $regex: safeDate, $options: "i" };
    }

    if (req.query.dateFrom || req.query.dateTo) {
      if (typeof filter.startDate !== "object" || filter.startDate === null) {
        filter.startDate = {};
      }
      if (req.query.dateFrom && req.query.dateFrom.trim()) {
        filter.startDate.$gte = req.query.dateFrom.trim().slice(0, 50);
      }
      if (req.query.dateTo && req.query.dateTo.trim()) {
        filter.startDate.$lte = req.query.dateTo.trim().slice(0, 50);
      }
    }

    if (
      (req.query.priceMin !== undefined && req.query.priceMin !== "") ||
      (req.query.priceMax !== undefined && req.query.priceMax !== "")
    ) {
      filter.price = {};
      if (req.query.priceMin !== undefined && req.query.priceMin !== "") {
        filter.price.$gte = Number(req.query.priceMin);
      }
      if (req.query.priceMax !== undefined && req.query.priceMax !== "") {
        filter.price.$lte = Number(req.query.priceMax);
      }
    }

    // Sort
    let sortOption = { createdAt: -1 };
    if (req.query.sortBy === "priceLow") sortOption = { price: 1 };
    if (req.query.sortBy === "priceHigh") sortOption = { price: -1 };
    if (req.query.sortBy === "dateAsc") sortOption = { startDate: 1 };
    if (req.query.sortBy === "dateDesc") sortOption = { startDate: -1 };

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

// @route GET /api/events/:id (public)
const getEventById = async (req, res) => {
  try {
    // ❌ Pehle: invalid ID (e.g. "abc") pe Mongoose CastError throw karta tha → 500
    // ✅ Ab: pehle check karo ID valid MongoDB ObjectId hai ya nahi → 400 dene ka
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID format." });
    }

    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/events/mine/all (protected — logged-in organizer ke apne events)
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/events/:id (protected, organizer only)
// @desc  Apna event update karo — sirf owner kar sakta hai
const updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID format." });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });

    // Ownership check — sirf event ka organizer update kar sakta hai
    // toString() zaroori hai kyunki ObjectId aur string directly compare nahi hote
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized. You can only edit your own events." });
    }

    // Sirf allowed fields accept karo — same allowlist as createEvent
    const {
      title, synopsis, category, price, tags,
      startDate, startTime, endDate, endTime,
      timezone, format, venue, address, city, coordinates, streamUrl,
      previewImage, galleryImages, selectedTier, tierDetails,
      agenda, promoVideo, privacy,
    } = req.body;

    // Validation — required fields
    if (title !== undefined && !title?.trim()) {
      return res.status(400).json({ message: "Event title cannot be empty." });
    }
    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    // Sirf woh fields update karo jo request mein bheje gaye hain (partial update)
    // $set operator se purani values preserve hongi jo update mein nahi hain
    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (synopsis !== undefined) updateFields.synopsis = synopsis.trim();
    if (category !== undefined) updateFields.category = category;
    if (price !== undefined) updateFields.price = Number(price);
    if (tags !== undefined) updateFields.tags = Array.isArray(tags) ? tags : [];
    if (startDate !== undefined) updateFields.startDate = startDate;
    if (startTime !== undefined) updateFields.startTime = startTime;
    if (endDate !== undefined) updateFields.endDate = endDate;
    if (endTime !== undefined) updateFields.endTime = endTime;
    if (timezone !== undefined) updateFields.timezone = timezone;
    if (format !== undefined) updateFields.format = format;
    if (venue !== undefined) updateFields.venue = venue.trim();
    if (address !== undefined) updateFields.address = address;
    if (city !== undefined) updateFields.city = city.trim();
    if (coordinates !== undefined && typeof coordinates === "object") {
      updateFields.coordinates = {
        lat: Number(coordinates.lat) || 0,
        lng: Number(coordinates.lng) || 0,
      };
    }
    if (streamUrl !== undefined) updateFields.streamUrl = streamUrl;
    if (previewImage !== undefined) updateFields.previewImage = previewImage;
    if (galleryImages !== undefined) updateFields.galleryImages = Array.isArray(galleryImages) ? galleryImages : [];
    if (selectedTier !== undefined) updateFields.selectedTier = selectedTier;
    if (tierDetails !== undefined) updateFields.tierDetails = tierDetails;
    if (agenda !== undefined) updateFields.agenda = agenda;
    if (promoVideo !== undefined) updateFields.promoVideo = promoVideo;
    if (privacy !== undefined) updateFields.privacy = privacy;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true } // new:true → updated doc return karo
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /api/events/:id (protected, organizer only)
// @desc  Apna event delete karo — sirf owner kar sakta hai
const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID format." });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });

    // Ownership check
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized. You can only delete your own events." });
    }

    // Cascade delete associated tickets so attendees do not have dangling broken tickets
    await Ticket.deleteMany({ event: req.params.id });
    await event.deleteOne();

    res.json({ message: "Event deleted successfully.", deletedId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createEvent, getEvents, getEventById, getMyEvents, updateEvent, deleteEvent };