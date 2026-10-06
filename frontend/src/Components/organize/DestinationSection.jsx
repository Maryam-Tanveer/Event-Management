import { useState } from "react";
import { MapPin, Video, Link as LinkIcon, Search, Compass, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

function DestinationSection({ eventData, setEventData }) {
  const formats = ["In-Person", "Hybrid", "Virtual"];
  const [geocoding, setGeocoding] = useState(false);

  // Default coordinates fallback: Manhattan, NY (40.7128, -74.0060)
  const coords = eventData.coordinates?.lat && eventData.coordinates?.lng
    ? eventData.coordinates
    : { lat: 40.7128, lng: -74.006 };

  // Generate dynamic map query string
  const locationString = [eventData.venue, eventData.address, eventData.city]
    .filter(Boolean)
    .join(", ");

  const mapQuery = encodeURIComponent(
    locationString || "Central Park, New York, NY"
  );

  // Dynamic OpenStreetMap embed with marker
  const mapEmbedUrl = eventData.coordinates?.lat && eventData.coordinates?.lng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01}%2C${coords.lat - 0.01}%2C${coords.lng + 0.01}%2C${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`
    : `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  // Geocode address via OpenStreetMap Nominatim
  const handleGeocode = async () => {
    const query = [eventData.address, eventData.venue, eventData.city]
      .filter(Boolean)
      .join(", ");

    if (!query.trim()) {
      toast.error("Please enter a venue, address, or city first.");
      return;
    }

    try {
      setGeocoding(true);
      toast.loading("Locating venue on map...", { id: "geo-toast" });

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setEventData((prev) => ({
          ...prev,
          coordinates: { lat, lng },
        }));

        toast.success("Location confirmed on map!", { id: "geo-toast" });
      } else {
        toast("Exact coordinates not found. Using street address query.", {
          id: "geo-toast",
          icon: "📍",
        });
      }
    } catch (err) {
      toast.error("Geocoding service unavailable. Using address map query.", {
        id: "geo-toast",
      });
    } finally {
      setGeocoding(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-[#e8e0d8] p-8">
      {/* Section header + format badges */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#b8862f] uppercase">
          03 / Destination & Transmission
        </h3>
        <div className="flex gap-2 ml-auto">
          {formats.map((fmt) => {
            const isActive = eventData.format === fmt;
            return (
              <button
                key={fmt}
                type="button"
                onClick={() =>
                  setEventData((prev) => ({
                    ...prev,
                    format: fmt,
                  }))
                }
                className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
                  isActive
                    ? "bg-[#c0392b] text-white shadow-sm"
                    : "bg-[#f0e6dc] text-[#3d2a2a] hover:bg-[#e8ddd1]"
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Venue, Address & City inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Venue */}
        <div>
          <label className="block text-xs font-semibold text-[#6b5e50] mb-1.5">
            Palace / Venue Designation <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 px-4 py-3 bg-[#2d1a0e] rounded-lg">
            <MapPin size={14} className="text-[#b8862f] shrink-0" />
            <input
              type="text"
              placeholder="e.g. The Metropolitan Club"
              value={eventData.venue || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, venue: e.target.value }))
              }
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-[#8a7a6a]"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-[#6b5e50] mb-1.5">
            Address & Street
          </label>
          <div className="flex items-center gap-2 px-4 py-3 bg-[#faf7f4] border border-[#e0d6cc] rounded-lg">
            <input
              type="text"
              placeholder="e.g. 1 East 60th Street"
              value={eventData.address || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full bg-transparent text-sm text-[#3d2a2a] focus:outline-none placeholder-[#a09080]"
            />
          </div>
        </div>

        {/* City / Quarter */}
        <div>
          <label className="block text-xs font-semibold text-[#6b5e50] mb-1.5">
            City & Region
          </label>
          <div className="flex items-center gap-2 px-4 py-3 bg-[#faf7f4] border border-[#e0d6cc] rounded-lg">
            <input
              type="text"
              placeholder="e.g. New York, NY"
              value={eventData.city || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, city: e.target.value }))
              }
              className="w-full bg-transparent text-sm text-[#3d2a2a] focus:outline-none placeholder-[#a09080]"
            />
          </div>
        </div>
      </div>

      {/* Geocode & Map Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-[#6b5e50]">
          <Compass size={14} className="text-[#b8862f]" />
          <span>Interactive Location Coordinates:</span>
          {eventData.coordinates?.lat ? (
            <span className="font-mono text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
              {eventData.coordinates.lat.toFixed(4)}, {eventData.coordinates.lng.toFixed(4)}
            </span>
          ) : (
            <span className="text-[11px] text-[#a09080] italic">
              Auto-updating via address
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGeocode}
            disabled={geocoding}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#2d1a0e] text-white hover:bg-[#3d2a2a] rounded-lg transition-colors disabled:opacity-60"
          >
            <Search size={12} />
            {geocoding ? "Locating..." : "Pinpoint On Map"}
          </button>
          {locationString && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#b8862f] hover:underline"
            >
              Verify on Google Maps <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Working Interactive Map Preview */}
      <div className="w-full h-56 rounded-xl overflow-hidden bg-[#e8e0d8] mb-3 relative border border-[#e0d6cc] shadow-inner">
        <iframe
          title="Interactive Venue Map"
          width="100%"
          height="100%"
          frameBorder="0"
          src={mapEmbedUrl}
          className="w-full h-full"
          loading="lazy"
        />

        {/* Dynamic map overlay badge */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-md border border-[#e8e0d8] max-w-[85%]">
          <MapPin size={16} className="text-[#b8862f] shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#3d2a2a] truncate">
              {eventData.venue || "Select Venue Designation"}
            </p>
            <p className="text-[10px] text-[#a09080] truncate">
              {[eventData.address, eventData.city].filter(Boolean).join(" · ") ||
                "Address and quarter coordinates"}
            </p>
          </div>
        </div>
      </div>

      {/* Streaming URL for Virtual/Hybrid */}
      {(eventData.format === "Hybrid" || eventData.format === "Virtual") && (
        <div className="mt-5 p-4 bg-[#2d1a0e] rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Video size={14} className="text-[#b8862f]" />
            <span className="text-[10px] font-bold tracking-[0.15em] text-white uppercase">
              Private Audiovisual Stream ({eventData.format} Guests)
            </span>
            <span className="ml-auto text-[10px] text-[#b8862f] font-semibold">
              4K UltraHD
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#1a0f06] rounded-lg">
            <LinkIcon size={14} className="text-[#8a7a6a] shrink-0" />
            <input
              type="text"
              placeholder="https://stream.luxeevents.com/access/..."
              value={eventData.streamUrl || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, streamUrl: e.target.value }))
              }
              className="w-full bg-transparent text-xs text-[#c9bfb3] focus:outline-none"
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default DestinationSection;
