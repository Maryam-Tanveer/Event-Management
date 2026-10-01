import React from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
  const navigate = useNavigate();

  const goToTicketPage = () => {
    if (!event.id) return;
    navigate("/tickets", { state: { eventId: event.id } });
  };

  return (
    <div
      onClick={goToTicketPage}
      className="bg-white rounded-2xl overflow-hidden border border-stone-100 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 right-3 text-[10px] tracking-wide font-medium bg-white/90 text-stone-700 px-2.5 py-1 rounded-full">
          {event.badge}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs font-medium text-orange-700">
          {event.date} • {event.time}
        </p>
        <h3 className="text-sm font-semibold text-stone-900 leading-snug">
          {event.title}
        </h3>
        <p className="flex items-center gap-1 text-xs text-stone-500">
          <MapPin size={12} />
          {event.location}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-sm font-medium text-stone-900">
            {event.priceLabel}
          </span>
          <button
            aria-label={`View ${event.title}`}
            onClick={(e) => {
              e.stopPropagation(); // card ka click dobara trigger na ho
              goToTicketPage();
            }}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;