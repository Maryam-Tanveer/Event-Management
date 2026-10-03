import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { Tag } from "lucide-react";

// ❌ Pehle tha: onApply(code) → parent mein client-side PROMO_CODES object se check hota tha
// Problem: codes browser mein visible the — DevTools se koi bhi dekh sakta tha
//
// ✅ Ab: Backend se validate karo → sirf discount rate return aata hai
// Codes kabhi frontend pe nahi aate
function PromoCodeInput({ onApply }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  // message: { type: "success" | "error", text: string } | null
  const [message, setMessage] = useState(null);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setLoading(true);
    setMessage(null);

    try {
      // Backend se validate karo — codes client pe nahi hain
      const { data } = await axiosInstance.post("/api/promo/validate", { code: trimmed });

      if (data.valid) {
        setApplied(true);
        setMessage({
          type: "success",
          text: `${data.appliedCode} applied — ${data.description}`,
        });
        toast.success(`Promo code applied: ${data.description}`);
        // Parent ko sirf discount rate aur code naam do — actual store entry nahi
        onApply(data.appliedCode, data.discount);
      } else {
        setApplied(false);
        setMessage({ type: "error", text: data.message || "Invalid promo code." });
        onApply(null, 0); // discount reset karo
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Could not validate code. Please try again.";
      setMessage({ type: "error", text: msg });
      onApply(null, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setApplied(false);
    setMessage(null);
    onApply(null, 0); // discount remove karo
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09080] pointer-events-none" />
          <input
            type="text"
            placeholder="Promo Code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase()); // auto-uppercase
              if (applied) {
                // Agar code change ho toh applied state reset
                setApplied(false);
                setMessage(null);
                onApply(null, 0);
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={applied}
            maxLength={20}
            className={`w-full pl-8 pr-3 py-2.5 bg-[#fbf3ec] border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b8862f] uppercase tracking-wider placeholder-normal ${
              applied ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {applied ? (
          // Applied state mein "Remove" button dikhao
          <button
            type="button"
            onClick={handleRemove}
            className="bg-[#f5e6d8] text-[#8b2d3a] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#edd5c0] transition-colors whitespace-nowrap"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="bg-[#e5dcd3] text-[#3d2a2a] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d6ccc2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "..." : "APPLY"}
          </button>
        )}
      </div>

      {/* Validation message */}
      {message && (
        <p className={`text-xs mt-2 flex items-center gap-1 ${
          message.type === "success" ? "text-green-700" : "text-red-600"
        }`}>
          <span>{message.type === "success" ? "✓" : "✕"}</span>
          {message.text}
        </p>
      )}
    </div>
  );
}

export default PromoCodeInput;
