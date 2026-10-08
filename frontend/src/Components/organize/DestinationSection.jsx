import { useEffect, useRef } from "react";
import { MapPin, Video, Link as LinkIcon, Trash2, Crosshair, Info } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom red SVG pin icon that matches the app aesthetic and doesn't depend on external assets
const createPinIcon = () =>
  L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="transform: translate(-50%, -100%);">
        <svg width="34" height="42" viewBox="0 0 384 512" fill="#dc2626" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 86.04 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" fill="#dc2626"/>
          <circle cx="192" cy="192" r="50" fill="#ffffff" />
        </svg>
      </div>
    `,
    iconSize: [0, 0],
  });

function DestinationSection({ eventData, setEventData }) {
  const formats = ["In-Person", "Hybrid / Stream"];
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const hasCoords =
    eventData.latitude !== null &&
    eventData.latitude !== undefined &&
    eventData.latitude !== "" &&
    !isNaN(Number(eventData.latitude)) &&
    eventData.longitude !== null &&
    eventData.longitude !== undefined &&
    eventData.longitude !== "" &&
    !isNaN(Number(eventData.longitude));

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const initialLat = hasCoords ? Number(eventData.latitude) : 40.7128;
    const initialLng = hasCoords ? Number(eventData.longitude) : -74.006;
    const initialZoom = hasCoords ? 15 : 12;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      scrollWheelZoom: "center",
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // If initial coordinates exist, place the saved marker
    if (hasCoords) {
      const pin = L.marker([Number(eventData.latitude), Number(eventData.longitude)], {
        icon: createPinIcon(),
        draggable: true,
      }).addTo(map);

      pin.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng();
        setEventData((prev) => ({
          ...prev,
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
        }));
      });

      markerRef.current = pin;
    }

    // Map click handler to drop/move pin
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      const formattedLat = Number(lat.toFixed(6));
      const formattedLng = Number(lng.toFixed(6));

      if (markerRef.current) {
        markerRef.current.setLatLng([formattedLat, formattedLng]);
      } else {
        const pin = L.marker([formattedLat, formattedLng], {
          icon: createPinIcon(),
          draggable: true,
        }).addTo(map);

        pin.on("dragend", (event) => {
          const pos = event.target.getLatLng();
          setEventData((prev) => ({
            ...prev,
            latitude: Number(pos.lat.toFixed(6)),
            longitude: Number(pos.lng.toFixed(6)),
          }));
        });

        markerRef.current = pin;
      }

      setEventData((prev) => ({
        ...prev,
        latitude: formattedLat,
        longitude: formattedLng,
      }));
    });

    mapInstanceRef.current = map;

    // Invalidate size to ensure clean tile rendering after layout paint
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Sync external changes to latitude & longitude with marker and view (e.g. edit load or clear)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (hasCoords) {
      const lat = Number(eventData.latitude);
      const lng = Number(eventData.longitude);

      if (markerRef.current) {
        const curPos = markerRef.current.getLatLng();
        if (
          Math.abs(curPos.lat - lat) > 0.00001 ||
          Math.abs(curPos.lng - lng) > 0.00001
        ) {
          markerRef.current.setLatLng([lat, lng]);
          map.setView([lat, lng], map.getZoom() || 15);
        }
      } else {
        const pin = L.marker([lat, lng], {
          icon: createPinIcon(),
          draggable: true,
        }).addTo(map);

        pin.on("dragend", (event) => {
          const pos = event.target.getLatLng();
          setEventData((prev) => ({
            ...prev,
            latitude: Number(pos.lat.toFixed(6)),
            longitude: Number(pos.lng.toFixed(6)),
          }));
        });

        markerRef.current = pin;
        map.setView([lat, lng], 15);
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [eventData.latitude, eventData.longitude, hasCoords, setEventData]);

  // Remove pin handler
  const handleClearPin = () => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    setEventData((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
    }));
  };

  // Center map on marker if placed
  const handleRecenter = () => {
    if (mapInstanceRef.current && hasCoords) {
      mapInstanceRef.current.setView(
        [Number(eventData.latitude), Number(eventData.longitude)],
        15
      );
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
              value={eventData.venue || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, venue: e.target.value }))
              }
              placeholder="e.g. Royal Albert Hall"
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
              value={eventData.address || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="e.g. Kensington Gore, London"
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

      {/* Coordinates status & controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 px-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#3d2a2a]">Location Pin:</span>
          {hasCoords ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Lat: {Number(eventData.latitude).toFixed(4)}, Lng:{" "}
              {Number(eventData.longitude).toFixed(4)}
            </span>
          ) : (
            <span className="text-[#a09080] italic">
              Click anywhere on the map to place a pin
            </span>
          )}
        </div>

        {hasCoords && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRecenter}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#6b5e50] bg-[#faf7f4] border border-[#e0d6cc] rounded hover:bg-[#ede5dc] transition-colors"
            >
              <Crosshair size={12} />
              Center Pin
            </button>
            <button
              type="button"
              onClick={handleClearPin}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
            >
              <Trash2 size={12} />
              Remove Pin
            </button>
          </div>
        )}
      </div>

      {/* Interactive Map */}
      <div className="w-full h-72 rounded-xl overflow-hidden border border-[#d5ccc3] relative shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating helper instruction overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border border-[#e0d6cc] text-[11px] text-[#5c4a4a] flex items-center gap-1.5 pointer-events-none">
          <Info size={13} className="text-[#b8862f] shrink-0" />
          <span>
            {hasCoords
              ? "Pin placed. Drag pin or click elsewhere to move."
              : "Click anywhere on the map to set coordinates"}
          </span>
        </div>
      </div>

      {/* Manual Latitude and Longitude fine-tuning inputs */}
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <label className="block text-[11px] font-medium text-[#7a6a6a] mb-1">
            Latitude (e.g. 40.7128)
          </label>
          <input
            type="number"
            step="any"
            value={eventData.latitude ?? ""}
            onChange={(e) => {
              const val = e.target.value === "" ? null : parseFloat(e.target.value);
              setEventData((prev) => ({ ...prev, latitude: val }));
            }}
            placeholder="Nullable (-90 to 90)"
            className="w-full px-3 py-2 bg-[#faf7f4] border border-[#e0d6cc] rounded-lg text-xs text-[#3d2a2a] focus:outline-none focus:border-[#b8862f]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#7a6a6a] mb-1">
            Longitude (e.g. -74.0060)
          </label>
          <input
            type="number"
            step="any"
            value={eventData.longitude ?? ""}
            onChange={(e) => {
              const val = e.target.value === "" ? null : parseFloat(e.target.value);
              setEventData((prev) => ({ ...prev, longitude: val }));
            }}
            placeholder="Nullable (-180 to 180)"
            className="w-full px-3 py-2 bg-[#faf7f4] border border-[#e0d6cc] rounded-lg text-xs text-[#3d2a2a] focus:outline-none focus:border-[#b8862f]"
          />
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
