const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    synopsis: { type: String, required: [true, "Synopsis is required"] },
    category: { type: String, default: "All Events" },
    price: { type: Number, default: 0 },
    tags: [{ type: String }],
    startDate: { type: String, required: [true, "Start date is required"] },
    startTime: { type: String },
    endDate: { type: String },
    endTime: { type: String },
    timezone: { type: String },
    format: { type: String, enum: ["In-Person", "Virtual", "Hybrid"], default: "In-Person" },
    venue: { type: String, required: [true, "Venue is required"] },
    address: { type: String },
    streamUrl: { type: String },
    previewImage: { type: String },
    galleryImages: [{ type: String }],
    qualityScore: { type: Number, default: 0 },
    selectedTier: { type: String },
    tierDetails: { type: String },
    agenda: { type: String },
    promoVideo: { type: String },
    privacy: { type: String, default: "Public" },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);