const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const promoRoutes = require("./routes/promoRoutes");

connectDB();

const app = express();

// ─── 0. TRUST PROXY ──────────────────────────────────────────────────────────
// Development mein React dev server (localhost:3000) se requests aati hain toh
// X-Forwarded-For header automatically add hota hai.
// express-rate-limit ye header dekh ke confuse ho jaata tha aur 403 deta tha.
//
// "loopback" setting ka matlab: sirf localhost (127.0.0.1) ko trusted proxy maano
// Production mein agar Nginx/Heroku/Railway use karo toh true ya 1 set karo
app.set("trust proxy", "loopback");

// ─── 1. HELMET — Security Headers ────────────────────────────────────────────
// Ye ek line 14+ HTTP security headers set kar deti hai automatically.
// Kya karta hai?
//   - XSS Protection: browser ko batata hai malicious scripts block karo
//   - Clickjacking: teri site ko iframe mein load hone se rokta hai
//   - MIME Sniffing: browser ko force karta hai declared content-type hi use kare
//   - Content-Security-Policy aur aur bhi bahut kuch
app.use(helmet());

// ─── 2. CORS — Sirf apni frontend ko allow karo ──────────────────────────────
// ❌ Pehle tha: app.use(cors()) — har koi API call kar sakta tha
// ✅ Ab: sirf FRONTEND_URL env variable se aane wali requests allow hogi
//
// Development mein FRONTEND_URL = http://localhost:3000
// Production mein FRONTEND_URL = https://yourdomain.com
//
// Agar FRONTEND_URL .env mein set nahi hai toh localhost:3000 fallback use hoga
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://event-management-k439.vercel.app", // Live frontend
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://localhost:5173", // Vite default
  "http://127.0.0.1:5173"
];


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow if no origin (e.g. Postman) or if it's in the allowed list
      // Also allow any localhost/127.0.0.1 origin in development to prevent 403s
      if (
        !origin || 
        allowedOrigins.includes(origin) || 
        (process.env.NODE_ENV !== "production" && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))
      ) {
        callback(null, true);
      } else {
        console.error(`CORS Error: Origin ${origin} is not allowed.`);
        callback(new Error(`CORS policy: Origin ${origin} is not allowed.`));
      }
    },
    credentials: true, // cookies / authorization headers allow karo
  })
);

// ─── 3. RATE LIMITING ────────────────────────────────────────────────────────
// Ye attack rokta hai: brute force login, spam registrations, DDoS attempts

// Auth routes ke liye strict limit — login/register pe attack hone ka sabse zyada chance
// 15 minute mein 20 requests max per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,  // Rate limit info response headers mein bhejo (RateLimit-*)
  legacyHeaders: false,   // purane X-RateLimit headers disable karo
});

// General API routes ke liye thoda loose limit
// 15 minute mein 200 requests per IP — normal users ke liye kaafi hai
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    message: "Too many requests from this IP. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── 4. Body Parser ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" })); // 10kb se bada body reject — large payload attacks rokta hai

// ─── 5. Health Check ─────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "LuxeEvents API is running..." });
});

// ─── 6. Routes ───────────────────────────────────────────────────────────────
// Auth routes pe strict limiter — brute force protection
app.use("/api/auth", authLimiter, authRoutes);

// Baaki routes pe general limiter
app.use("/api/events", generalLimiter, eventRoutes);
app.use("/api/tickets", generalLimiter, ticketRoutes);
app.use("/api/upload", generalLimiter, uploadRoutes);
app.use("/api/payment", generalLimiter, paymentRoutes);
app.use("/api/promo", generalLimiter, promoRoutes);

// ─── 7. Global Error Handler ─────────────────────────────────────────────────
// Koi bhi unhandled error yahan aayega — stack trace leak nahi hogi production mein
app.use((err, req, res, next) => {
  // CORS error ka specific message
  if (err.message && err.message.startsWith("CORS policy")) {
    return res.status(403).json({ message: err.message });
  }

  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: process.env.NODE_ENV === "production"
      ? "An unexpected error occurred."  // production mein details hide karo
      : err.message,                     // development mein full message dikhao
  });
});

// ─── 8. Start Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") { app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 CORS allowed origin: ${allowedOrigins.join(", ")}`);
});

}; module.exports = app;
