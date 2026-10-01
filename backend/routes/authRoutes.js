const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, forgotPassword, resetPassword, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);    // ✅ Profile update
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;