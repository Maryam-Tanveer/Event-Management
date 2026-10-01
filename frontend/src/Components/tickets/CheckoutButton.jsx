import React from "react";
import { Lock } from "lucide-react";

function CheckoutButton ({ onClick, label })  {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-[#4a1f2b] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#3a1620] transition-colors"
      >
        {label || "Secure Checkout"} <Lock size={16} />
      </button>
      <p className="text-center text-[10px] text-gray-400 mt-4">
        {label ? "Registration is free — no payment required." : "Guaranteed safe & secure checkout. Powered by Stripe."}
      </p>
    </>
  );
};

export default CheckoutButton;