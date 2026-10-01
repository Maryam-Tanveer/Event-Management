const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Node.js built-in — password reset token ke liye
const nodemailer = require("nodemailer");
const User = require("../models/User");

// JWT token generate karne ka helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // ❌ Pehle tha: const { name, email, password, role } = req.body;
    // Problem: koi bhi role: "organizer" bhej ke organizer ban jaata tha
    // ✅ Ab: role req.body se bilkul nahi lete — always "attendee" set karte hain
    // Organizer banana ek alag elevated action hona chahiye, self-service nahi

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Email format validate karo — mongoose mein ye check nahi tha
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Password minimum length check
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // role field intentionally nahi diya — User model ka default "attendee" use hoga
    // Ye ensures koi bhi direct API call se organizer nahi ban sakta
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // will always be "attendee"
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/auth/me (protected)
const getMe = async (req, res) => {
  res.json(req.user);
};

// @route POST /api/auth/forgot-password (public)
// @desc  Reset token generate karo aur email bhejo
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide your email address." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Security: chahe user mile ya na mile — same response dete hain
    // Ye "user enumeration" attack rokta hai (attacker ko pata na chale kon registered hai)
    if (!user) {
      return res.json({
        message: "If an account exists for this email, a reset link has been sent.",
      });
    }

    // --- Token generate karo ---
    // crypto.randomBytes(32) → 32 random bytes → hex string (64 chars)
    // Ye token email mein jaayega (plain) — DB mein hashed version store karenge
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Token ko hash karke DB mein store karo
    // Kyun hash? Agar DB leak ho jaaye toh bhi token usable na ho
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // --- Reset link banao ---
    // Frontend ka URL + raw token (unhashed) — user yahi click karega
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`;

    // --- Email bhejo ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,   // Gmail address from .env
        pass: process.env.EMAIL_PASS,   // Gmail App Password from .env
      },
    });

    const mailOptions = {
      from: `"LuxeEvents" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "LuxeEvents — Password Reset Request",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #FDF6EC; border-radius: 8px;">
          <h2 style="color: #3d2a2a; font-size: 22px; margin-bottom: 8px;">Reset Your Password</h2>
          <p style="color: #6b4c3b; font-size: 14px; line-height: 1.6;">
            You requested a password reset for your LuxeEvents account.
            Click the button below to set a new password. This link expires in <strong>10 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #3d1823; color: #FDF6EC; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 13px; font-weight: bold; letter-spacing: 0.1em;">
              RESET PASSWORD
            </a>
          </div>
          <p style="color: #9a8a8a; font-size: 11px; text-align: center;">
            If you did not request this, please ignore this email. Your password will remain unchanged.
          </p>
          <p style="color: #9a8a8a; font-size: 11px; text-align: center;">
            Or copy this link: <a href="${resetUrl}" style="color: #8C6B45;">${resetUrl}</a>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    // Agar email send fail ho toh token DB se hata do — stale tokens na rahein
    await User.updateOne(
      { email: req.body.email?.toLowerCase().trim() },
      { $unset: { resetPasswordToken: "", resetPasswordExpire: "" } }
    ).catch(() => {}); // silently fail cleanup
    res.status(500).json({ message: "Failed to send reset email. Please try again later." });
  }
};

// @route POST /api/auth/reset-password (public)
// @desc  Token verify karo aur password update karo
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Email mein raw token tha — DB mein hashed version se match karo
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Token DB mein dhundho — aur expiry check karo
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // token abhi expired nahi hua
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token. Please request a new reset link.",
      });
    }

    // --- Password update karo ---
    user.password = password; // pre-save hook automatically hash karega
    user.resetPasswordToken = undefined; // token delete karo — one-time use
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now sign in with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/auth/profile (protected)
// @desc  Apna naam, email ya password update karo
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const { name, email, currentPassword, newPassword } = req.body;

    // --- Name update ---
    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: "Name cannot be empty." });
      user.name = name.trim();
    }

    // --- Email update ---
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please provide a valid email address." });
      }
      const normalizedEmail = email.toLowerCase().trim();

      // Duplicate email check — kisi aur ka email nahi lena
      if (normalizedEmail !== user.email) {
        const emailTaken = await User.findOne({ email: normalizedEmail });
        if (emailTaken) {
          return res.status(400).json({ message: "This email is already in use by another account." });
        }
        user.email = normalizedEmail;
      }
    }

    // --- Password update (optional) ---
    if (newPassword) {
      // Current password confirm zaroori hai — identity verify
      if (!currentPassword) {
        return res.status(400).json({ message: "Please provide your current password to set a new one." });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters." });
      }
      user.password = newPassword; // pre-save hook hash karega
    }

    await user.save();

    // Updated user data return karo (token preserve karo — naya token nahi chahiye)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: req.user.token || generateToken(user._id), // existing token reuse karo
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, forgotPassword, resetPassword, updateProfile };