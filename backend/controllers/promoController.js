// @route  POST /api/promo/validate (protected)
// @desc   Promo code validate karo aur discount rate return karo
//
// ❌ Pehle tha: PROMO_CODES frontend mein hardcode — DevTools se visible
// ✅ Ab: codes SIRF backend mein hain — client ko sirf discount rate milta hai
//
// Real production app mein ye DB mein hote hain (expiry, usage limit, etc.)
// Abhi ke liye in-memory store use kar rahe hain — easily DB mein migrate ho sakta hai

// Promo code store — sirf backend pe, client kabhi nahi dekh sakta
// Structure: { code: { discount: 0.1, description: "10% off", active: true } }
const PROMO_STORE = {
  LUXE10: { discount: 0.10, description: "10% off your order", active: true },
  GALA20: { discount: 0.20, description: "20% off your order", active: true },
  WELCOME: { discount: 0.15, description: "15% welcome discount", active: true },
};

const validatePromoCode = (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Please provide a promo code." });
    }

    // Normalize — uppercase aur trim karo
    const normalizedCode = code.trim().toUpperCase();

    // Length check — reasonable limit
    if (normalizedCode.length > 20) {
      return res.status(400).json({ valid: false, message: "Invalid promo code." });
    }

    const promo = PROMO_STORE[normalizedCode];

    // Code exist nahi karta ya inactive hai
    if (!promo || !promo.active) {
      // Security: "code not found" aur "code inactive" same response dena chahiye
      // Taaki attacker inference na kar sake
      return res.status(200).json({ valid: false, message: "Invalid or expired promo code." });
    }

    // ✅ Valid code — discount rate return karo (code ki actual value nahi)
    return res.status(200).json({
      valid: true,
      discount: promo.discount,          // e.g. 0.10 = 10%
      description: promo.description,    // e.g. "10% off your order"
      appliedCode: normalizedCode,       // normalized code wapas bhejo (e.g. "LUXE10")
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { validatePromoCode };
