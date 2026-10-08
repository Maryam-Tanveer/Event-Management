const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware — ye check karega ki request ke sath valid token hai ya nahi
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_for_tests_and_development_luxeevents");

      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Sirf organizer role wale users ko allow karega
const organizerOnly = (req, res, next) => {
  if (req.user && req.user.role === "organizer") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Organizer role required." });
};

module.exports = { protect, organizerOnly };