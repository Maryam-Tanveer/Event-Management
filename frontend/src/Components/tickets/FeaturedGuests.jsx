import React from "react";
import GuestCard from "./GuestCard";

// ✅ Guests ab event se prop ke zariye aate hain — hardcoded nahi
function FeaturedGuests({ guests = [] }) {

  // Agar event me guests nahi hain — kuch mat dikho
  if (!guests || guests.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-serif text-[#3d2a2a] mb-6">Featured Guests</h2>
      <div className="grid grid-cols-2 gap-6">
        {guests.map((guest, idx) => (
          <GuestCard key={idx} {...guest} />
        ))}
      </div>
    </div>
  );
}

export default FeaturedGuests;