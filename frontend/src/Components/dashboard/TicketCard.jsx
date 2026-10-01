import { useState } from "react";
import QRModal from "./QRModal";

// ❌ Pehle tha: "View QR Code" button kuch nahi karta tha
// ✅ Ab: click pe QRModal open hota hai — real QR code with ticket data

function TicketCard({ ticket }) {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <div className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        {/* Event image */}
        <div className="relative w-40 h-auto shrink-0">
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2 left-2 bg-white/90 text-[10px] font-semibold px-2 py-1 rounded tracking-wide uppercase">
            {ticket.category}
          </span>
        </div>

        {/* Ticket info */}
        <div className="flex-1 p-5">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-serif font-semibold text-gray-900">
              {ticket.title}
            </h3>
            <span className="text-xs bg-[#F5E6D8] text-gray-700 px-3 py-1 rounded-full font-medium shrink-0 ml-2">
              {ticket.accessType}
            </span>
          </div>

          <div className="mt-3 space-y-1.5 text-sm text-gray-600">
            <p className="flex items-center gap-2">📅 {ticket.date}</p>
            <p className="flex items-center gap-2">📍 {ticket.location}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
            <span className="text-gray-500">🎫 Ticket #{ticket.ticketId}</span>
            {/* ✅ Ab ye button QRModal open karta hai */}
            <button
              onClick={() => setShowQR(true)}
              className="text-[#4A0E1C] font-medium hover:underline transition-colors"
            >
              View QR Code
            </button>
          </div>
        </div>
      </div>

      {/* QR Modal — showQR true hone par render hoga */}
      {showQR && (
        <QRModal
          ticket={ticket}
          onClose={() => setShowQR(false)}
        />
      )}
    </>
  );
}

export default TicketCard;
