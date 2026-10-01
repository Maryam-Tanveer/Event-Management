import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // ❌ Pehle tha: setTimeout fake success — email kabhi nahi jaata tha
      // ✅ Ab: real backend call — token generate hota hai, email jaata hai
      await axios.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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

        <div className="h-px bg-gray-200 w-full mb-8"></div>

        {sent ? (
          <>
            <h3 className="text-[28px] font-serif text-[#3d2a2a] mb-3">Check your inbox</h3>
            <p className="text-[13px] text-[#7a6a6a] leading-relaxed mb-8">
              If an account exists for <span className="font-semibold text-[#3d2a2a]">{email}</span>, a secure reset link has been sent.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-[28px] font-serif text-[#3d2a2a] mb-3">
              Reset your access
            </h3>
            <p className="text-[13px] text-[#7a6a6a] leading-relaxed mb-8">
              Enter the email registered to your membership and we'll send a secure link to restore entry to <span className="font-semibold text-[#3d2a2a]">Concierge Access</span>.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block text-[11px] text-[#7a6a6a] mb-2">
                  Official Member Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  className="w-full bg-[#FDF6EC] border-none px-4 py-3.5 rounded-md text-[13px] text-[#3d2a2a] placeholder-[#9a8a8a] focus:outline-none focus:ring-1 focus:ring-[#8C6B45]"
                />
              </div>

              {error && <p className="text-red-600 text-[12px] mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3d1823] hover:bg-[#2c1119] text-[#FDF6EC] py-3.5 rounded-md text-[13px] font-semibold tracking-[0.1em] flex items-center justify-center gap-2 transition-colors mb-6 disabled:opacity-60"
              >
                {loading ? "SENDING..." : "SEND RESET LINK"} <ArrowRight size={16} strokeWidth={2.5}/>
              </button>
            </form>
          </>
        )}

        <div className="mb-8">
          <Link to="/signin" className="inline-flex items-center gap-1.5 text-[12px] text-[#8C6B45] hover:underline">
            <ArrowLeft size={14} />
            Return to Sign In
          </Link>
        </div>

        <div className="h-px bg-gray-200 w-full mb-6"></div>

        <div className="text-center text-[10px] text-[#9a8a8a] leading-relaxed">
          Access subject to verification under the LuxeEvents Charter. <a href="/" className="underline decoration-[#d4c5b9] hover:text-[#5c4a4a]">Concierge Terms</a> & <a href="/" className="underline decoration-[#d4c5b9] hover:text-[#5c4a4a]">Discretion Policy</a>.
        </div>

      </div>
    </div>
  );
}

export default ForgotPasswordPage;