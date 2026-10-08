const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    // User ka ticket verify karke hi review allow hoga
    isVerifiedAttendee: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ek user ek event ke liye sirf ek review de sakta hai
reviewSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
