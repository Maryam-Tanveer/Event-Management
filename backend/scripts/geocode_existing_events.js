require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("../models/Event");
const { geocodeVenueAddress } = require("../utils/geocoder");

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const events = await Event.find({});
    console.log(`Found ${events.length} events to check.`);

    let updated = 0;
    for (const ev of events) {
      console.log(`\nEvent: "${ev.title}" (Venue: "${ev.venue}", Address: "${ev.address}")`);
      if (ev.latitude !== null && ev.longitude !== null && !isNaN(ev.latitude) && !isNaN(ev.longitude)) {
        console.log(`Already has coordinates: [${ev.latitude}, ${ev.longitude}]`);
        continue;
      }

      console.log("Geocoding location...");
      const geo = await geocodeVenueAddress(ev.venue, ev.address);
      if (geo) {
        ev.latitude = geo.latitude;
        ev.longitude = geo.longitude;
        await Event.findByIdAndUpdate(ev._id, {
          latitude: geo.latitude,
          longitude: geo.longitude,
        });
        console.log(`Saved coordinates: [${geo.latitude}, ${geo.longitude}]`);
        updated++;
      } else {
        console.log("Geocoding failed for this event.");
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log(`\nDone. Updated ${updated} of ${events.length} events.`);
    process.exit(0);
  } catch (err) {
    console.error("Error during migration:", err);
    process.exit(1);
  }
}

run();
