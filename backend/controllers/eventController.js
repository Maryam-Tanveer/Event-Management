const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");
const { geocodeVenueAddress, fetchFromNominatim } = require("../utils/geocoder");

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
      promoVideo, privacy, latitude, longitude,
    } = req.body;

    if (!title?.trim())   return res.status(400).json({ message: "Event title is required." });
    if (!synopsis?.trim()) return res.status(400).json({ message: "Synopsis is required." });
    if (!venue?.trim())   return res.status(400).json({ message: "Venue is required." });
    if (!startDate?.trim()) return res.status(400).json({ message: "Start date is required." });
    if (price !== undefined && Number(price) < 0)
      return res.status(400).json({ message: "Price cannot be negative." });

    let parsedLat = null;
    if (latitude !== undefined && latitude !== null && latitude !== "") {
      parsedLat = Number(latitude);
      if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
        return res.status(400).json({ message: "Invalid latitude. Must be between -90 and 90." });
      }
    }

    let parsedLng = null;
    if (longitude !== undefined && longitude !== null && longitude !== "") {
      parsedLng = Number(longitude);
      if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
        return res.status(400).json({ message: "Invalid longitude. Must be between -180 and 180." });
      }
    }

    // Coordinates na hon to auto-geocode karo OpenStreetMap Nominatim se
    if ((parsedLat === null || parsedLng === null) && (venue || address)) {
      try {
        const geo = await geocodeVenueAddress(venue, address);
        if (geo) {
          if (parsedLat === null) parsedLat = geo.latitude;
          if (parsedLng === null) parsedLng = geo.longitude;
        }
      } catch (err) {
        console.error("Auto-geocoding error during event creation:", err.message);
      }
    }

    const event = await Event.create({
      title: title.trim(),
      synopsis: synopsis.trim(),
      category: category || "All Events",
      price: price !== undefined ? Number(price) : 0,
      tags: Array.isArray(tags) ? tags : [],
      startDate, startTime, endDate, endTime, timezone, format,
      venue: venue.trim(), address, streamUrl,
      latitude: parsedLat,
      longitude: parsedLng,
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
    const andConditions = [];

    // ✅ Featured filter — Landing Page ke liye
    if (req.query.featured === "true") {
      andConditions.push({ isFeatured: true });
    }

    if (req.query.category && req.query.category !== "All Events") {
      andConditions.push({ category: req.query.category });
    }

    if (req.query.search) {
      const rawSearch = req.query.search.trim();
      if (rawSearch.length > 100)
        return res.status(400).json({ message: "Search query too long (max 100 characters)." });
      const safeSearch = escapeRegex(rawSearch);
      andConditions.push({
        $or: [
          { title:    { $regex: safeSearch, $options: "i" } },
          { venue:    { $regex: safeSearch, $options: "i" } },
          { synopsis: { $regex: safeSearch, $options: "i" } },
        ]
      });
    }

    if (req.query.location) {
      const safeLocation = escapeRegex(req.query.location.trim());
      andConditions.push({
        $or: [
          { venue: { $regex: safeLocation, $options: "i" } },
          { address: { $regex: safeLocation, $options: "i" } }
        ]
      });
    }

    if (req.query.date) {
      andConditions.push({ startDate: req.query.date.trim() });
    }

    if (req.query.dateFrom || req.query.dateTo) {
      const dateRangeCond = {};
      if (req.query.dateFrom && req.query.dateFrom.trim()) {
        dateRangeCond.$gte = req.query.dateFrom.trim();
      }
      if (req.query.dateTo && req.query.dateTo.trim()) {
        dateRangeCond.$lte = req.query.dateTo.trim();
      }
      andConditions.push({ startDate: dateRangeCond });
    }

    if (req.query.priceMin !== undefined || req.query.priceMax !== undefined) {
      const priceCondition = {};
      if (req.query.priceMin) priceCondition.$gte = Number(req.query.priceMin);
      if (req.query.priceMax) priceCondition.$lte = Number(req.query.priceMax);
      andConditions.push({ price: priceCondition });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
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

    // Agar coordinates missing hain lekin venue/address maujood hai, to geocode karo aur DB me save/cache karo
    const hasLat = event.latitude !== null && event.latitude !== undefined;
    const hasLng = event.longitude !== null && event.longitude !== undefined;
    if ((!hasLat || !hasLng) && (event.venue || event.address)) {
      try {
        const geo = await geocodeVenueAddress(event.venue, event.address);
        if (geo) {
          event.latitude = geo.latitude;
          event.longitude = geo.longitude;
          await Event.findByIdAndUpdate(event._id, {
            latitude: geo.latitude,
            longitude: geo.longitude,
          });
        }
      } catch (geoErr) {
        console.error("Geocoding failed for event:", event._id, geoErr.message);
      }
    }

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
      timezone, format, venue, address, city, coordinates, streamUrl,
      previewImage, galleryImages, selectedTier, tierDetails,
      agendaSlots, guests, amenities, maxTickets,
      promoVideo, privacy, latitude, longitude,
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
    if (latitude !== undefined) {
      if (latitude === null || latitude === "") {
        u.latitude = null;
      } else {
        const parsedLat = Number(latitude);
        if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
          return res.status(400).json({ message: "Invalid latitude. Must be between -90 and 90." });
        }
        u.latitude = parsedLat;
      }
    }
    if (longitude !== undefined) {
      if (longitude === null || longitude === "") {
        u.longitude = null;
      } else {
        const parsedLng = Number(longitude);
        if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
          return res.status(400).json({ message: "Invalid longitude. Must be between -180 and 180." });
        }
        u.longitude = parsedLng;
      }
    }
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

    // Agar coordinates abhi bhi missing hain aur venue ya address maujood hai to auto-geocode karo
    const effectiveVenue = u.venue !== undefined ? u.venue : event.venue;
    const effectiveAddress = u.address !== undefined ? u.address : event.address;
    const effectiveLat = u.latitude !== undefined ? u.latitude : event.latitude;
    const effectiveLng = u.longitude !== undefined ? u.longitude : event.longitude;

    if ((effectiveLat === null || effectiveLng === null) && (effectiveVenue || effectiveAddress)) {
      try {
        const geo = await geocodeVenueAddress(effectiveVenue, effectiveAddress);
        if (geo) {
          u.latitude = geo.latitude;
          u.longitude = geo.longitude;
        }
      } catch (err) {
        console.error("Auto-geocoding error during event update:", err.message);
      }
    }

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

    // Cascade delete associated tickets so attendees do not have dangling broken tickets
    await Ticket.deleteMany({ event: req.params.id });
    await event.deleteOne();
    res.json({ message: "Event deleted successfully.", deletedId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/events/geocode  (public)
const geocodeLocation = async (req, res) => {
  try {
    const { q, venue, address } = req.query;
    if (q) {
      const geo = await fetchFromNominatim(q);
      return res.json(geo || { message: "Location not found" });
    }
    const geo = await geocodeVenueAddress(venue, address);
    return res.json(geo || { message: "Location not found" });
  } catch (error) {
    res.status(500).json({ message: "Geocoding error", error: error.message });
  }
};

module.exports = {
  createEvent, getEvents, getEventById,
  getMyEvents, updateEvent, deleteEvent, getCategories,
  geocodeLocation,
};