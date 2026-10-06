const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
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
    ticketType: {
      type: String,
      required: [true, "Ticket type is required"],
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    promoCode: {
      type: String,
    },
    // Stripe ka unique payment ID — refunds ke liye aur proof ke liye zaroori
    // Free events ke liye null allowed hai (isFreeTicket: true)
    paymentIntentId: {
      type: String,
      unique: true,
      sparse: true, // sparse: true means null values are NOT indexed — multiple free tickets allowed
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
    // Free event registration flag — payment nahi tha
    isFreeTicket: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);