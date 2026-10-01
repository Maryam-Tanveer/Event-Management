const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, organizerOnly } = require("../middleware/auth");

// Zaroori order: "/mine/all" route "/:id" se PEHLE hona chahiye
// warna Express "mine" ko event ID samajh lega
router.get("/mine/all", protect, getMyEvents);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", protect, organizerOnly, createEvent);
router.put("/:id", protect, organizerOnly, updateEvent);    // ✅ Event update
router.delete("/:id", protect, organizerOnly, deleteEvent); // ✅ Event delete

module.exports = router;
