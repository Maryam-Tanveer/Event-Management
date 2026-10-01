const express = require("express");
const router = express.Router();
const { purchaseTicket, registerFreeTicket, getMyTickets } = require("../controllers/ticketController");
const { protect } = require("../middleware/auth");

router.post("/", protect, purchaseTicket);
router.post("/free", protect, registerFreeTicket); // Free events ke liye — no payment needed
router.get("/mine", protect, getMyTickets);

module.exports = router;