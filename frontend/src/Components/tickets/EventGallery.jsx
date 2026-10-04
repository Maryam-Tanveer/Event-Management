import React from "react";

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