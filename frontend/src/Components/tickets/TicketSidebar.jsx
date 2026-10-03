import React, { useState, useMemo } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import EventInfoBlock from "./EventInfoBlock";
import TicketOption from "./TicketOption";
import QuantitySelector from "./QuantitySelector";
import PromoCodeInput from "./PromoCodeInput";
import OrderSummary from "./OrderSummary";
import CheckoutButton from "./CheckoutButton";
import StripeCheckout from "../payment/StripeCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

const TAX_RATE = 0.05;

// VIP premium multiplier — VIP tier ki price Standard se 1.8x hogi
// e.g. event.price = $100 → Standard = $100, VIP = $180
const VIP_MULTIPLIER = 1.8;

// ❌ Pehle tha: hardcoded ticketTypes array with fixed $250 / $450
// Problem: har event pe same prices — DB ka price bilkul ignore hota tha
//
// ✅ Ab: buildTicketTypes(basePrice) — event ke actual price se tiers banao
// Free event    → sirf "General Admission (Free)" — koi payment nahi
// Paid event    → Standard (base price) + VIP (base × 1.8)
const buildTicketTypes = (basePrice) => {
  const price = Number(basePrice) || 0;

  if (price === 0) {
    // Free event — sirf ek option, koi payment sidebar nahi dikhana chahiye
    return [
      {
        id: "general",
        label: "General Admission",
        price: 0,
        description: "Free entry — register to reserve your spot.",
        isFree: true,
      },
    ];
  }

  return [
    {
      id: "standard",
      label: "Standard Admission",
      price: price,
      description: "Full event access including all general sessions and networking areas.",
    },
    {
      id: "vip",
      label: "VIP Experience",
      price: Math.round(price * VIP_MULTIPLIER * 100) / 100, // round to 2 decimals
      description:
        "All standard perks plus priority seating, exclusive lounge access, and complimentary welcome reception.",
      popular: true,
    },
  ];
};

function TicketSidebar({ event }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // event.price se ticket tiers dynamically banao
  const ticketTypes = useMemo(
    () => buildTicketTypes(event?.price ?? 0),
    [event?.price]
  );

  const [selectedTicketId, setSelectedTicketId] = useState(
    // Default: VIP select karo agar available hai, warna pehla option
    () => (ticketTypes.find((t) => t.id === "vip") ? "vip" : ticketTypes[0]?.id)
  );
  const [quantity, setQuantity] = useState(1);
  const [appliedCode, setAppliedCode] = useState(null);
  // Promo discount rate — backend se validate hoga (FIX #9 mein)
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showStripe, setShowStripe] = useState(false);

  // Agar ticketTypes change ho (event prop change) toh selected reset karo
  const selectedTicket = ticketTypes.find((t) => t.id === selectedTicketId) || ticketTypes[0];

  const isFreeEvent = selectedTicket?.isFree || selectedTicket?.price === 0;

  const { subtotal, discount, taxes, total } = useMemo(() => {
    const sub = (selectedTicket?.price || 0) * quantity;
    const disc = promoDiscount > 0 ? sub * promoDiscount : 0;
    const tax = isFreeEvent ? 0 : (sub - disc) * TAX_RATE;
    return {
      subtotal: sub,
      discount: disc,
      taxes: tax,
      total: sub - disc + tax,
    };
  }, [selectedTicket, quantity, promoDiscount, isFreeEvent]);

  const handleIncrease = () => setQuantity((q) => Math.min(q + 1, 10)); // max 10 tickets
  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));

  // Promo code apply — backend ne already validate kar diya
  // PromoCodeInput se (appliedCode, discountRate) milte hain
  // ❌ Pehle tha: client-side PROMO_CODES object check — codes visible in source
  // ✅ Ab: backend validated discount rate directly set karo
  const handleApplyPromo = (code, discountRate) => {
    if (code && discountRate > 0) {
      setAppliedCode(code);
      setPromoDiscount(discountRate);
    } else {
      // Code remove hua ya invalid
      setAppliedCode(null);
      setPromoDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    if (!event?.id) {
      toast.error("This is a demo event. Please use a real event from the database.");
      return;
    }
    if (isFreeEvent) {
      // Free events ke liye direct ticket create — payment nahi
      handleFreeTicket();
      return;
    }
    setShowStripe(true);
  };

  // Free event registration — Stripe nahi, seedha ticket create
  const handleFreeTicket = async () => {
    try {
      toast.loading("Registering...", { id: "free-ticket-toast" });
      await axiosInstance.post("/api/tickets/free", {
        eventId: event.id,
        ticketType: selectedTicket.label,
        quantity,
      });
      toast.success("Successfully registered!", { id: "free-ticket-toast" });
      navigate("/my-events");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg, { id: "free-ticket-toast" });
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      // totalAmount backend calculate karega (event.price × quantity)
      // Promo code bhi backend validate karega (FIX #9)
      await axiosInstance.post("/api/tickets", {
        eventId: event.id,
        ticketType: selectedTicket.label,
        quantity,
        paymentIntentId,
        ...(appliedCode && { promoCode: appliedCode }), // FIX #9 ke liye ready
      });
      toast.success("Ticket booked successfully!");
      navigate("/my-events");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Ticket save failed. Please contact support with your payment ID.";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
      <EventInfoBlock event={event} />

      <div className="mb-6">
        <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">
          Select Tickets
        </h3>
        <div className="space-y-3">
          {ticketTypes.map((ticket) => (
            <TicketOption
              key={ticket.id}
              id={ticket.id}
              label={ticket.label}
              // ✅ Price event.price se aati hai — DB se real value
              price={ticket.price === 0 ? "Free" : `$${ticket.price.toLocaleString()}`}
              description={ticket.description}
              popular={ticket.popular}
              selected={selectedTicketId === ticket.id}
              onSelect={setSelectedTicketId}
            />
          ))}
        </div>
      </div>

      <QuantitySelector
        quantity={quantity}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
      />

      {/* Promo code sirf paid events pe dikhao */}
      {!isFreeEvent && (
        <PromoCodeInput onApply={handleApplyPromo} />
      )}

      <OrderSummary
        subtotal={subtotal}
        discount={discount}
        taxes={taxes}
        total={total}
      />

      {/* Free event: direct register button | Paid event: Stripe */}
      {showStripe && !isFreeEvent ? (
        <Elements stripe={stripePromise}>
          <StripeCheckout amount={total} onSuccess={handlePaymentSuccess} />
        </Elements>
      ) : (
        <CheckoutButton
          onClick={handleCheckout}
          label={isFreeEvent ? "Register for Free" : undefined}
        />
      )}

      {!user && (
        <p className="text-center text-[11px] text-gray-400 mt-3">
          You will need to sign in to complete checkout.
        </p>
      )}
    </div>
  );
}

export default TicketSidebar;
