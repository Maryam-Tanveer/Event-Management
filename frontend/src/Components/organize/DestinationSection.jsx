import { MapPin, Video, Link as LinkIcon } from "lucide-react";

function DestinationSection({ eventData, setEventData }) {
  const formats = ["In-Person", "Hybrid / Stream"];

  return (
    <section className="bg-white rounded-2xl border border-[#e8e0d8] p-8">
      {/* Section header + format badges */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#b8862f] uppercase">
          03 / Destination & Transmission
        </h3>
        <div className="flex gap-2 ml-auto">
          {formats.map((fmt) => {
            const isActive =
              eventData.format === fmt ||
              (fmt === "Hybrid / Stream" &&
                (eventData.format === "Hybrid" ||
                  eventData.format === "Stream"));
            return (
              <button
                key={fmt}
                onClick={() =>
                  setEventData((prev) => ({
                    ...prev,
                    format: fmt === "Hybrid / Stream" ? "Hybrid" : fmt,
                  }))
                }
                className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
                  isActive
                    ? "bg-[#c0392b] text-white"
                    : "bg-[#f0e6dc] text-[#3d2a2a] hover:bg-[#e8ddd1]"
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Venue & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-[#6b5e50] mb-1.5">
            Palace / Venue Designation
          </label>
          <div className="flex items-center gap-2 px-4 py-3 bg-[#2d1a0e] rounded-lg">
            <MapPin size={14} className="text-[#b8862f] shrink-0" />
            <input
              type="text"
              value={eventData.venue}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, venue: e.target.value }))
              }
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-[#8a7a6a]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#6b5e50] mb-1.5">
            Address & Quarter
          </label>
          <div className="flex items-center gap-2 px-4 py-3 bg-[#faf7f4] border border-[#e0d6cc] rounded-lg">
            <input
              type="text"
              value={eventData.address}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full bg-transparent text-sm text-[#3d2a2a] focus:outline-none placeholder-[#a09080]"
            />
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="w-full h-48 rounded-xl overflow-hidden bg-[#e8e0d8] mb-3 relative">
        <img
          src="https://api.mapbox.com/styles/v1/mapbox/light-v11/static/12.3326,45.4371,14,0/600x250@2x?access_token=pk.placeholder"
          alt="Venue Map"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentNode.innerHTML =
              '<div class="w-full h-full flex items-center justify-center bg-[#e8e0d8]"><p class="text-sm text-[#a09080]">📍 Map — Palazzo Pisani Moretta, Venice</p></div>';
          }}
        />
        {/* Map overlay label */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
          <MapPin size={14} className="text-[#b8862f]" />
          <div>
            <p className="text-xs font-semibold text-[#3d2a2a]">
              Grand Canal Waterfront Dock
            </p>
            <p className="text-[10px] text-[#a09080]">
              Private Water Taxi Coordinates Confirmed
            </p>
          </div>
        </div>
      </div>

      {/* Streaming URL */}
      <div className="mt-5 p-4 bg-[#2d1a0e] rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Video size={14} className="text-[#b8862f]" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-white uppercase">
            Private Audiovisual Stream (Hybrid Guests)
          </span>
          <span className="ml-auto text-[10px] text-[#b8862f] font-semibold">
            4K UltraHD
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#1a0f06] rounded-lg">
          <LinkIcon size={14} className="text-[#8a7a6a] shrink-0" />
          <input
            type="text"
            value={eventData.streamUrl}
            onChange={(e) =>
              setEventData((prev) => ({ ...prev, streamUrl: e.target.value }))
            }
            className="w-full bg-transparent text-xs text-[#c9bfb3] focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}

export default DestinationSection;
