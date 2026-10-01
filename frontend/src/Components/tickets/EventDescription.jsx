import React from "react";

function EventDescription({ event }) {
  return (
    <div className="text-[#3d2a2a] space-y-4">
      <h1 className="text-3xl font-serif">{event?.title}</h1>
      <p className="text-sm leading-relaxed">
        {event?.description || "More details about this event will be shared soon."}
      </p>
    </div>
  );
}

export default EventDescription;