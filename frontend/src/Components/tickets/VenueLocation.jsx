import React from "react";
import { Map as MapIcon, ParkingSquare, Accessibility, ExternalLink, MapPinOff } from "lucide-react";

// Amenity icon mapping
const AMENITY_ICONS = {
  "Valet Parking":         <ParkingSquare size={16} />,
  "Wheelchair Accessible": <Accessibility size={16} />,
  "Free Parking":          <ParkingSquare size={16} />,
};

function VenueLocation({ event }) {
  const locationName = event?.location || event?.venue || "";
  const address      = event?.address || "";
  const amenities    = event?.amenities || [];
  const latitude     = event?.latitude;
  const longitude    = event?.longitude;

  const hasCoords =
    latitude !== null &&
    latitude !== undefined &&
    latitude !== "" &&
    !isNaN(Number(latitude)) &&
    longitude !== null &&
    longitude !== undefined &&
    longitude !== "" &&
    !isNaN(Number(longitude));

  // Agar na location name ho na coordinates, render mat karo
  if (!locationName && !hasCoords) return null;

  const latNum = hasCoords ? Number(latitude) : null;
  const lngNum = hasCoords ? Number(longitude) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
      <div className="space-y-4 text-[#3d2a2a]">
        <h2 className="text-xl font-serif">Venue &amp; Location</h2>
        <p className="text-sm">
          {locationName || "Location details"}
          {address && ` — ${address}`}
        </p>

        {/* Dynamic amenities */}
        {amenities.length > 0 && (
          <ul className="space-y-2">
            {amenities.map((amenity, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                {AMENITY_ICONS[amenity] || <MapIcon size={16} />}
                {amenity}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-[#e5dcd3] h-64 rounded-xl flex items-center justify-center relative overflow-hidden shadow-md">
        {hasCoords ? (
          <>
            {/* Open in Maps external link button */}
            <a
              href={`https://www.google.com/maps?q=${latNum},${lngNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 left-3 z-10 bg-white hover:bg-gray-50 text-blue-600 font-medium text-xs px-3 py-1.5 rounded shadow-md flex items-center gap-1.5 transition-colors border border-gray-200"
            >
              Open in Maps
              <ExternalLink size={13} className="text-blue-600" />
            </a>

            {/* Google Maps embed centered at lat,lng with pin and zoom 15 */}
            <iframe
              title="Event Location"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${latNum},${lngNum}&z=15&output=embed`}
              allowFullScreen
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-[#7a6a6a]">
            <MapPinOff size={32} className="text-[#a09080] mb-2" />
            <p className="text-sm font-semibold text-[#5c4a4a]">Location not available</p>
            <p className="text-xs text-[#8a7a6a] mt-1">Coordinates not provided for this event</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VenueLocation;
