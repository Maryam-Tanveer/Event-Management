import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { Lock, CreditCard } from "lucide-react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      color: "#3d2a2a",
      fontFamily: "serif",
      "::placeholder": { color: "#9a8a8a" },
    },
    invalid: { color: "#e05252" },
  },
};

function StripeCheckout({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    toast.loading("Processing payment...", { id: "stripe-pay" });

    try {
      // 1. Ask backend to create a PaymentIntent
      const { data } = await axios.post("/api/payment/create-intent", { amount });

      // 2. Confirm card payment on Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        toast.error(result.error.message, { id: "stripe-pay" });
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!", { id: "stripe-pay" });
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed.", { id: "stripe-pay" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="mt-4">
      <div className="bg-[#faf7f4] border border-[#e0d6cc] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={14} className="text-[#8C6B45]" />
          <span className="text-[11px] font-semibold text-[#5c4a4a] uppercase tracking-wider">Secure Payment</span>
        </div>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#3d1823] hover:bg-[#2c1119] text-white text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-60"
      >
        <Lock size={13} />
        {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
      <p className="text-center text-[10px] text-[#9a8a8a] mt-2">
        Secured by Stripe. Your payment information is encrypted.
      </p>
    </form>
  );
}

export default StripeCheckout;
