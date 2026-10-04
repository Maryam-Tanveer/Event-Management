import React from "react";
import { Map as MapIcon, ParkingSquare, Accessibility } from "lucide-react";

// ✅ Amenities ab event.amenities se aati hain — hardcoded nahi
// Icon mapping for common amenities
const AMENITY_ICONS = {
  "Valet Parking":         <ParkingSquare size={16} />,
  "Wheelchair Accessible": <Accessibility size={16} />,
  "Free Parking":          <ParkingSquare size={16} />,
};

function VenueLocation({ event }) {
  const locationName = event?.location || event?.venue || "";
  const address      = event?.address || "";
  const amenities    = event?.amenities || [];

  // Agar koi location hi nahi — render mat karo
  if (!locationName) return null;

  const mapQuery = encodeURIComponent(`${locationName} ${address}`);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="grid grid-cols-2 gap-8 items-center py-8">
      <div className="space-y-4 text-[#3d2a2a]">
        <h2 className="text-xl font-serif">Venue &amp; Location</h2>
        <p className="text-sm">
          {locationName}
          {address && ` — ${address}`}
        </p>

        {/* ✅ Dynamic amenities — sirf wahi dikhao jo organizer ne set kiye */}
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
        <iframe
          title="Event Location"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapSrc}
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default VenueLocation;
