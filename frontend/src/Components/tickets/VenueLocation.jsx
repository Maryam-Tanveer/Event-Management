import React from "react";
import { Map as MapIcon } from "lucide-react";

function VenueLocation({ event }) {
  const locationName = event?.location || "The Heritage Hall";
  const address = event?.address || "Elegance Avenue, Historic Arts District";
  const mapQuery = encodeURIComponent(`${locationName} ${address}`);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="grid grid-cols-2 gap-8 items-center py-8">
      <div className="space-y-4 text-[#3d2a2a]">
        <h2 className="text-xl font-serif">Venue & Location</h2>
        <p className="text-sm">
          {locationName} is located at {address}. Valet parking is available
          at the main entrance.
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">P</span> Complimentary Valet for VIP
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapIcon size={16} /> Wheelchair Accessible
        </div>
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
        ></iframe>
      </div>
    </div>
  );
}

export default VenueLocation;
