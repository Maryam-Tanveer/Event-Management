import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { X, User, Mail, Lock, Eye, EyeOff, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function EditProfileModal({ onClose }) {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Client-side validation
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name cannot be empty.";
    if (!email.trim()) errs.email = "Email cannot be empty.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email format.";
    if (newPassword && !currentPassword) errs.currentPassword = "Enter current password to change it.";
    if (newPassword && newPassword.length < 6) errs.newPassword = "Min. 6 characters required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = { name, email };
      // Password fields sirf tab bhejo jab user actually change karna chahta ho
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const { data } = await axiosInstance.put("/api/auth/profile", payload);

      // AuthContext mein user state update karo
      updateUser(data);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed. Please try again.";
      toast.error(msg);
      // Specific field error handle karo
      if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
      else if (msg.toLowerCase().includes("current password")) setErrors({ currentPassword: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-serif font-semibold text-[#3d2a2a]">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center pt-6 pb-2">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=8C6B45&color=fff&size=128`}
            alt="Avatar preview"
            className="w-16 h-16 rounded-full border-2 border-[#e8ddd0]"
          />
        </div>
        <p className="text-center text-[10px] text-gray-400 mb-4">Avatar updates automatically with your name</p>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">

          {/* Name */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5c4a4a] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a09080]" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                className={`w-full pl-9 pr-4 py-3 bg-[#FDF6EC] rounded-lg text-sm text-[#3d2a2a] placeholder-[#a09080] focus:outline-none focus:ring-2 focus:ring-[#b8862f] border ${errors.name ? "border-red-300" : "border-transparent"}`}
                placeholder="Your full name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5c4a4a] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a09080]" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                className={`w-full pl-9 pr-4 py-3 bg-[#FDF6EC] rounded-lg text-sm text-[#3d2a2a] placeholder-[#a09080] focus:outline-none focus:ring-2 focus:ring-[#b8862f] border ${errors.email ? "border-red-300" : "border-transparent"}`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Change Password (optional)</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5c4a4a] uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a09080]" />
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setErrors((p) => ({ ...p, currentPassword: "" })); }}
                className={`w-full pl-9 pr-10 py-3 bg-[#FDF6EC] rounded-lg text-sm text-[#3d2a2a] placeholder-[#a09080] focus:outline-none focus:ring-2 focus:ring-[#b8862f] border ${errors.currentPassword ? "border-red-300" : "border-transparent"}`}
                placeholder="Required only if changing password"
              />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a09080]">
                {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-red-500 text-[11px] mt-1">{errors.currentPassword}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5c4a4a] uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a09080]" />
              <input
                type={showNewPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: "" })); }}
                className={`w-full pl-9 pr-10 py-3 bg-[#FDF6EC] rounded-lg text-sm text-[#3d2a2a] placeholder-[#a09080] focus:outline-none focus:ring-2 focus:ring-[#b8862f] border ${errors.newPassword ? "border-red-300" : "border-transparent"}`}
                placeholder="Leave blank to keep current password"
              />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a09080]">
                {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-[11px] mt-1">{errors.newPassword}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#3d1823] hover:bg-[#2c1119] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <Save size={14} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
