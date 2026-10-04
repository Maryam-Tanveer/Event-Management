import React, { useState } from "react";
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
import { useMemo } from "react";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

// ✅ TAX_RATE env se aata hai — hardcoded nahi
const TAX_RATE = parseFloat(process.env.REACT_APP_TAX_RATE || "0.05");

// ✅ VIP price — organizer ke set price se, ya fallback multiplier
// Agar event.vipPrice set hai toh woh use karo, warna 1.8x
const VIP_MULTIPLIER = 1.8;

const buildTicketTypes = (basePrice) => {
  const price = Number(basePrice) || 0;
  if (price === 0) {
    return [{
      id: "general", label: "General Admission", price: 0,
      description: "Free entry — register to reserve your spot.", isFree: true,
    }];
  }
  return [
    {
      id: "standard", label: "Standard Admission", price,
      description: "Full event access including all general sessions and networking areas.",
    },
    {
      id: "vip", label: "VIP Experience",
      price: Math.round(price * VIP_MULTIPLIER * 100) / 100,
      description: "Priority seating, exclusive lounge access, and complimentary welcome reception.",
      popular: true,
    },
  ];
};

function TicketSidebar({ event }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const ticketTypes = useMemo(() => buildTicketTypes(event?.price ?? 0), [event?.price]);

  const [selectedTicketId, setSelectedTicketId] = useState(
    () => (ticketTypes.find((t) => t.id === "vip") ? "vip" : ticketTypes[0]?.id)
  );
  const [quantity, setQuantity]         = useState(1);
  const [appliedCode, setAppliedCode]   = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showStripe, setShowStripe]     = useState(false);

  const selectedTicket = ticketTypes.find((t) => t.id === selectedTicketId) || ticketTypes[0];
  const isFreeEvent    = selectedTicket?.isFree || selectedTicket?.price === 0;

  // ✅ Max quantity — event.maxTickets se, fallback 10
  const maxQty = event?.maxTickets ? Math.min(event.maxTickets, 10) : 10;

  const { subtotal, discount, taxes, total } = useMemo(() => {
    const sub  = (selectedTicket?.price || 0) * quantity;
    const disc = promoDiscount > 0 ? sub * promoDiscount : 0;
    const tax  = isFreeEvent ? 0 : (sub - disc) * TAX_RATE;
    return { subtotal: sub, discount: disc, taxes: tax, total: sub - disc + tax };
  }, [selectedTicket, quantity, promoDiscount, isFreeEvent]);

  const handleIncrease = () => setQuantity((q) => Math.min(q + 1, maxQty));
  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));

  const handleApplyPromo = (code, discountRate) => {
    if (code && discountRate > 0) {
      setAppliedCode(code);
      setPromoDiscount(discountRate);
    } else {
      setAppliedCode(null);
      setPromoDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (!user) { navigate("/signin"); return; }
    if (!event?.id) {
      toast.error("This is a demo event. Please use a real event from the database.");
      return;
    }
    if (isFreeEvent) { handleFreeTicket(); return; }
    setShowStripe(true);
  };

  const handleFreeTicket = async () => {
    try {
      toast.loading("Registering...", { id: "free-ticket-toast" });
      await axiosInstance.post("/api/tickets/free", {
        eventId: event.id, ticketType: selectedTicket.label, quantity,
      });
      toast.success("Successfully registered!", { id: "free-ticket-toast" });
      navigate("/my-events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.", { id: "free-ticket-toast" });
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      await axiosInstance.post("/api/tickets", {
        eventId: event.id, ticketType: selectedTicket.label, quantity, paymentIntentId,
        ...(appliedCode && { promoCode: appliedCode }),
      });
      toast.success("Ticket booked successfully!");
      navigate("/my-events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Ticket save failed. Please contact support.");
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
        max={maxQty}
      />

      {/* Promo code sirf paid events pe */}
      {!isFreeEvent && <PromoCodeInput onApply={handleApplyPromo} />}

      <OrderSummary subtotal={subtotal} discount={discount} taxes={taxes} total={total} />

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
