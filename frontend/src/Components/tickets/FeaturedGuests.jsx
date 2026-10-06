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

function FeaturedGuests({ event }) {
  const hostGuests = event?.organizer?.name
    ? [
        {
          name: event.organizer.name,
          role: "Curator & Host",
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer.name)}&background=8C6B45&color=fff&size=200`,
        },
        ...guests.slice(0, 1),
      ]
    : guests;

  return (
    <div>
      <h2 className="text-xl font-serif text-[#3d2a2a] mb-6">Featured Guests & Curators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {hostGuests.map((guest) => (
          <GuestCard key={guest.name} {...guest} />
        ))}
      </div>
    </div>
  );
}

export default FeaturedGuests;