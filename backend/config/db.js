const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/luxeevents");
    console.log("✅ MongoDB Connected successfully");

    // Fix legacy unique non-sparse index on tickets collection if present
    try {
      const ticketColl = mongoose.connection.collection("tickets");
      const indexes = await ticketColl.indexes();
      const pIndex = indexes.find((i) => i.name === "paymentIntentId_1");
      if (pIndex && !pIndex.sparse) {
        await ticketColl.dropIndex("paymentIntentId_1");
        console.log("ℹ️ Dropped legacy non-sparse paymentIntentId_1 index.");
      }
    } catch (_) {
      // Collection or index may not exist yet
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;