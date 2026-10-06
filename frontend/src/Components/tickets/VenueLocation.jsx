import React from "react";
import { MapPin, Navigation, ExternalLink, Video, CheckCircle2 } from "lucide-react";

function VenueLocation({ event }) {
  const venue = event?.venue || event?.location || "Heritage Event Hall";
  const address = event?.address || "Arts District Quarter";
  const city = event?.city || "";
  const format = event?.format || "In-Person";
  const coordinates = event?.coordinates;

  const fullLocationString = [venue, address, city].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(fullLocationString);

  // Map embed URL — centered on exact coordinates or location string
  const mapSrc = coordinates?.lat && coordinates?.lng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01}%2C${coordinates.lat - 0.01}%2C${coordinates.lng + 0.01}%2C${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lng}`
    : `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div id="venue-map" className="bg-white rounded-2xl border border-[#e8e0d8] p-6 lg:p-8 my-8 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left column: Location details */}
        <div className="space-y-4 text-[#3d2a2a]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#b8862f]">
              Destination & Access
            </span>
            <span className="text-[10px] bg-[#f5e6d8] text-[#8C6B45] px-2.5 py-0.5 rounded-full font-semibold">
              {format}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-[#2d1a0e]">
            {venue}
          </h2>

          <p className="text-sm text-[#6b5e50] leading-relaxed">
            Located at <span className="font-semibold text-[#3d2a2a]">{address}</span>
            {city && <span> in <span className="font-semibold text-[#3d2a2a]">{city}</span></span>}.
            Private concierge check-in will greet guests at the main portico entrance.
          </p>

          <div className="space-y-2 pt-2 text-sm text-[#5c4a4a]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#b8862f] shrink-0" />
              <span>Complimentary Valet Parking for Patrons</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#b8862f] shrink-0" />
              <span>Wheelchair Accessible & Elevators Available</span>
            </div>
            {(format === "Hybrid" || format === "Virtual") && (
              <div className="flex items-center gap-2 text-amber-900">
                <Video size={16} className="text-[#b8862f] shrink-0" />
                <span>Simultaneous 4K UltraHD Audiovisual Broadcast Included</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3d1823] hover:bg-[#2c1119] text-white text-xs font-semibold rounded-full transition-colors shadow-sm"
            >
              <Navigation size={14} /> Get Directions
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#d5ccc3] hover:bg-stone-50 text-[#3d2a2a] text-xs font-semibold rounded-full transition-colors"
            >
              Open in Google Maps <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Right column: Interactive Map Frame */}
        <div className="h-64 sm:h-72 rounded-xl overflow-hidden relative shadow-inner border border-[#e0d6cc] bg-[#f0e6dc]">
          <iframe
            title="Event Venue Location"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapSrc}
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
          />

          {/* Map pin card overlay */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-md border border-[#e8e0d8] max-w-[85%]">
            <MapPin size={16} className="text-[#b8862f] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#3d2a2a] truncate">
                {venue}
              </p>
              <p className="text-[10px] text-[#a09080] truncate">
                {[address, city].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueLocation;
