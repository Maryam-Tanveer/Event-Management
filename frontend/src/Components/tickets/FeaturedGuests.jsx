import React from "react";
import GuestCard from "./GuestCard";

const guests = [
  {
    name: "Chef Julian Vance",
    role: "Culinary Director",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80",
  },
  {
    name: "Elena Rostova",
    role: "Lead Vocalist",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
  },
];

function FeaturedGuests() {
  return (
    <div>
      <h2 className="text-xl font-serif text-[#3d2a2a] mb-6">Featured Guests</h2>
      <div className="grid grid-cols-2 gap-6">
        {guests.map((guest) => (
          <GuestCard key={guest.name} {...guest} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedGuests;