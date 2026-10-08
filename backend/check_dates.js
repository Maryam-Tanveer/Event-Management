const mongoose = require("mongoose");
const Event = require("./models/Event");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/events").then(async () => {
    const event = await Event.findOne();
    console.log("Sample Event startDate:", event.startDate);
    const eventWithDate = await Event.find({ startDate: "2026-12-01" });
    console.log("Matches for 2026-12-01:", eventWithDate.length);
    console.log("All events:", await Event.countDocuments());
    process.exit();
});
