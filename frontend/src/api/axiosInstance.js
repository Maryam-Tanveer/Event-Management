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

export default axiosInstance;
