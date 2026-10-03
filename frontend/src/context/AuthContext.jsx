import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post("/api/auth/login", { email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const registerUser = async (name, email, password, role) => {
    const res = await axiosInstance.post("/api/auth/register", { name, email, password, role });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Profile update ke baad local user state + localStorage sync karo
  // Ye function EditProfileModal call karega API success ke baad
  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem("user", JSON.stringify(merged));
    // Token change nahi hua toh axios header wahi rahega
  };

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}