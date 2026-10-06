const express = require("express");
const router = express.Router();
const { subscribe, submitInquiry } = require("../controllers/newsletterController");

router.post("/subscribe", subscribe);
router.post("/contact", submitInquiry);

module.exports = router;
