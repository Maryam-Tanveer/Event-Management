import React from "react";

function EventGallery({ event }) {
  return (
    <div className="space-y-4">
      <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
        <img
          src={event?.image}
          alt={event?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-[#4a1f2b] text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">
            {event?.badge}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <img src="https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80" alt="Gallery 1" className="w-full h-24 object-cover rounded-lg" />
        <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80" alt="Gallery 2" className="w-full h-24 object-cover rounded-lg" />
        <img src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80" alt="Gallery 3" className="w-full h-24 object-cover rounded-lg" />
        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80" alt="Gallery 4" className="w-full h-24 object-cover rounded-lg" />
      </div>
    </div>
  );
}

export default EventGallery;