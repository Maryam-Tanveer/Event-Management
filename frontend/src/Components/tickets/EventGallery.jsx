import React, { useState, useEffect } from "react";

const fallbackThumbnails = [
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
];

function EventGallery({ event }) {
  const [activeImage, setActiveImage] = useState(event?.image);

  useEffect(() => {
    setActiveImage(event?.image);
  }, [event?.image]);

  const displayImages =
    event?.galleryImages && event.galleryImages.length > 0
      ? event.galleryImages
      : fallbackThumbnails;

  return (
    <div className="space-y-4">
      {/* Main hero image */}
      <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-[#e8e0d8] bg-black/5">
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

      {/* Gallery Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {displayImages.slice(0, 4).map((imgUrl, idx) => {
          const isSelected = (activeImage || event?.image) === imgUrl;
          return (
            <button
              type="button"
              key={idx}
              onClick={() => setActiveImage(imgUrl)}
              className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#b8862f] ring-2 ring-[#b8862f]/40 scale-[1.02]"
                  : "border-transparent opacity-80 hover:opacity-100 hover:border-stone-300"
              }`}
            >
              <img
                src={imgUrl}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EventGallery;