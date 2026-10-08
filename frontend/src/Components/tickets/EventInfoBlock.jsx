import React from "react";
import { Clock, MapPin } from "lucide-react";

function EventInfoBlock({ event }) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-3 text-[#3d2a2a]">
        <Clock className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
        <div>
          <p className="font-medium">{event?.date}</p>
          <p className="text-sm text-gray-500">{event?.time}</p>
        </div>
      </div>
      <div className="flex gap-3 text-[#3d2a2a]">
        <MapPin className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
        <div>
          <p className="font-medium">{event?.location}</p>
          <button
            type="button"
            onClick={() => document.getElementById("venue-map")?.scrollIntoView({ behavior: "smooth" })}
            className="text-xs text-[#b8862f] hover:text-[#8b2d3a] underline font-medium mt-1 inline-block text-left"
          >
            View Map & Directions
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventInfoBlock;