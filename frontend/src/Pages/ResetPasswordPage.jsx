import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // URL se token lo: /reset-password?token=abc123

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Agar token URL mein nahi hai — invalid link
  if (!token) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-serif text-[#3d2a2a] font-bold mb-3">Invalid Link</h2>
          <p className="text-[13px] text-[#7a6a6a] mb-6">
            This password reset link is invalid or has expired.
            Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-[#3d1823] text-[#FDF6EC] py-3 px-6 rounded-md text-[13px] font-semibold hover:bg-[#2c1119] transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/api/auth/reset-password", { token, password });
      setDone(true);
      toast.success("Password reset successful!");
      // 2 second baad signin pe redirect
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#FDF6EC] py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8">

        <div className="mb-6">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#8C6B45] font-semibold mb-1">
            Private Members Portal
          </h2>
          <h1 className="text-2xl font-serif text-[#3d2a2a] font-bold">LuxeEvents</h1>
        </div>

        <div className="h-px bg-gray-200 w-full mb-8" />

        {done ? (
          /* Success state */
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-green-600 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-[24px] font-serif text-[#3d2a2a] mb-2">Password Updated</h3>
            <p className="text-[13px] text-[#7a6a6a] mb-6">
              Your password has been reset successfully. Redirecting you to sign in...
            </p>
            <Link
              to="/signin"
              className="text-[#8C6B45] text-[13px] hover:underline"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h3 className="text-[28px] font-serif text-[#3d2a2a] mb-3">Set New Password</h3>
            <p className="text-[13px] text-[#7a6a6a] leading-relaxed mb-8">
              Enter a new password for your <span className="font-semibold text-[#3d2a2a]">LuxeEvents</span> account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-4">

                {/* New Password */}
                <div>
                  <label className="block text-[11px] text-[#7a6a6a] mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Min. 6 characters"
                      className="w-full bg-[#FDF6EC] border-none px-4 py-3.5 rounded-md text-[13px] text-[#3d2a2a] placeholder-[#9a8a8a] focus:outline-none focus:ring-1 focus:ring-[#8C6B45]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a8a] hover:text-[#5c4a4a]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] text-[#7a6a6a] mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      placeholder="Re-enter password"
                      className="w-full bg-[#FDF6EC] border-none px-4 py-3.5 rounded-md text-[13px] text-[#3d2a2a] placeholder-[#9a8a8a] focus:outline-none focus:ring-1 focus:ring-[#8C6B45]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a8a] hover:text-[#5c4a4a]"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-600 text-[12px] mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3d1823] hover:bg-[#2c1119] text-[#FDF6EC] py-3.5 rounded-md text-[13px] font-semibold tracking-[0.1em] flex items-center justify-center gap-2 transition-colors mb-6 disabled:opacity-60"
              >
                {loading ? "UPDATING..." : "RESET PASSWORD"} <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </form>

            <div className="mb-4">
              <Link to="/signin" className="text-[12px] text-[#8C6B45] hover:underline">
                ← Back to Sign In
              </Link>
            </div>
          </>
        )}

        <div className="h-px bg-gray-200 w-full mt-4 mb-6" />
        <p className="text-center text-[10px] text-[#9a8a8a]">
          Access subject to verification under the LuxeEvents Charter.
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
