// ─── Production-Safe Error Response Helper ────────────────────────────────────
// Controllers mein har jagah yahi use karo catch blocks mein.
//
// Production mein:  sirf generic "Server error" dikhao (stack trace hidden)
// Development mein: full error.message dikhao (debugging ke liye)
//
// Usage:
//   } catch (error) {
//     return serverError(res, error);
//   }

const serverError = (res, error, statusCode = 500) => {
  // Always log server-side for debugging
  console.error("Server Error:", error?.message || error);

  const isDev = process.env.NODE_ENV !== "production";

  return res.status(statusCode).json({
    message: "Server error",
    ...(isDev && { detail: error?.message }),
  });
};

module.exports = { serverError };
