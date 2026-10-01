import React from "react";

function AgendaItem({ title, location, track }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#e8d5c4]">
      {track && (
        <span className="text-xs font-semibold text-[#b8862f] uppercase tracking-wider mb-1 block">
          {track}
        </span>
      )}
      <h3 className="text-[#3d2a2a] font-medium text-sm">{title}</h3>
      {location && (
        <p className="text-[#7a5c5c] text-xs mt-1">📍 {location}</p>
      )}
    </div>
  );
}

export default AgendaItem;
