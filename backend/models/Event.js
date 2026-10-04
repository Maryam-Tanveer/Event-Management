const mongoose = require("mongoose");

// ─── Guest Sub-schema ─────────────────────────────────────────────────────────
const guestSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    role:  { type: String, trim: true },
    image: { type: String },
  },
  { _id: false }
);

// ─── Agenda Session Sub-schema ────────────────────────────────────────────────
const sessionSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    track:    { type: String, trim: true }, // e.g. "Track A", "Track B"
  },
  { _id: false }
);

const agendaSlotSchema = new mongoose.Schema(
  {
    time:     { type: String, required: true }, // e.g. "07:00 PM"
    sessions: [sessionSchema],
  },
  { _id: false }
);

// ─── Main Event Schema ────────────────────────────────────────────────────────
const eventSchema = new mongoose.Schema(
  {
    title:     { type: String, required: [true, "Title is required"], trim: true },
    synopsis:  { type: String, required: [true, "Synopsis is required"] },
    category:  { type: String, default: "All Events" },
    price:     { type: Number, default: 0 },
    tags:      [{ type: String }],
    startDate: { type: String, required: [true, "Start date is required"] },
    startTime: { type: String },
    endDate:   { type: String },
    endTime:   { type: String },
    timezone:  { type: String },
    format:    { type: String, enum: ["In-Person", "Virtual", "Hybrid"], default: "In-Person" },
    venue:     { type: String, required: [true, "Venue is required"] },
    address:   { type: String },
    streamUrl: { type: String },
    previewImage:  { type: String },
    galleryImages: [{ type: String }],
    qualityScore:  { type: Number, default: 0 },
    selectedTier:  { type: String },
    tierDetails:   { type: String },

    // ── Structured fields (replaces old plain-string agenda) ──────────────────
    agendaSlots: [agendaSlotSchema],   // Array of time slots with multi-track sessions
    guests:      [guestSchema],         // Featured speakers / performers / guests
    amenities:   [{ type: String }],    // e.g. ["Valet Parking", "Wheelchair Accessible"]
    maxTickets:  { type: Number, default: null }, // null = unlimited

    // ── Discovery & rating ────────────────────────────────────────────────────
    isFeatured:  { type: Boolean, default: false }, // shown on Landing Page
    avgRating:   { type: Number, default: 0 },       // recomputed after each review
    reviewCount: { type: Number, default: 0 },

    promoVideo: { type: String },
    privacy:    { type: String, default: "Public" },
    organizer:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);