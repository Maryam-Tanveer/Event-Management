import React, { useState, useEffect } from "react";

const fallbackThumbnails = [
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
];

// ✅ Gallery images ab event.galleryImages se aati hain — hardcoded URLs nahi
function EventGallery({ event }) {
  const images = event?.galleryImages?.length > 0
    ? event.galleryImages
    : [];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
        <img
          src={activeImage || event?.image}
          alt={event?.title || "Event display"}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-[#4a1f2b] text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md shadow">
            {event?.badge || "EVENT"}
          </span>
          {event?.category && (
            <span className="bg-white/90 backdrop-blur-sm text-[#3d2a2a] px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md shadow">
              {event?.category}
            </span>
          )}
        </div>
      </div>

      {/* ✅ Thumbnail gallery — only real images from DB */}
      {images.length > 0 && (
        <div className={`grid gap-4 grid-cols-${Math.min(images.length, 4)}`}>
          {images.slice(0, 4).map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventGallery;