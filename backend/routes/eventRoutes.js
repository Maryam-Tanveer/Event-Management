const express = require("express");
const router = express.Router();
const {
  createEvent, getEvents, getEventById,
  getMyEvents, updateEvent, deleteEvent, getCategories,
  geocodeLocation,
} = require("../controllers/eventController");
const { protect, organizerOnly } = require("../middleware/auth");

// ✅ Static routes pehle — "mine", "categories", aur "geocode" ko /:id se pehle rakho
router.get("/mine/all",   protect, getMyEvents);
router.get("/categories", getCategories);         // ✅ Dynamic categories for sidebar
router.get("/geocode",    geocodeLocation);       // ✅ Public geocoding helper
router.get("/",           getEvents);
router.get("/:id",        getEventById);
router.post("/",          protect, organizerOnly, createEvent);
router.put("/:id",        protect, organizerOnly, updateEvent);
router.delete("/:id",     protect, organizerOnly, deleteEvent);

module.exports = router;
