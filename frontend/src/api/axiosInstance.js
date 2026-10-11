import axios from "axios";

// Development mein proxy kaam karta tha (package.json ka "proxy" field)
// Live/Production mein proxy kaam nahi karta — isliye baseURL manually set karna padta hai
//
// REACT_APP_API_URL = backend ka live URL (e.g. https://your-backend.vercel.app)
// Agar env variable set nahi hai toh development ke liye localhost fallback use hoga
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookies / authorization headers allow karo
});

// Har request pe automatically Authorization header attach karo (agar token ho)
axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.token) {
        config.headers["Authorization"] = `Bearer ${parsedUser.token}`;
      }
    } catch (e) {
      // localStorage mein invalid JSON hai — ignore karo
    }
  }
  return config;
});

// ── Response interceptor: Token expire ho jaaye toh auto-logout karo ──────────
// Agar backend 401 return kare (token invalid/expired) toh:
// 1. localStorage se user data hata do
// 2. User ko /signin pe redirect karo
// Isse user "stuck" nahi hoga unauthorized state mein
axiosInstance.interceptors.response.use(
  (response) => response, // success — as-is return karo
  (error) => {
    if (error.response?.status === 401) {
      // Sirf tab logout karo jab user actually logged in ho
      // (agar pehle se localStorage empty hai toh bhi koi issue nahi)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        localStorage.removeItem("user");
        // Hard redirect — React state bhi reset ho jaata hai
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
