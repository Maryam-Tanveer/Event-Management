import React from "react";
import AgendaItem from "./AgendaItem";

// Each slot has a time and one or more sessions.
// One session = full-width row. Two+ sessions = side-by-side tracks.
const agendaSlots = [
  {
    time: "07:00 PM",
    sessions: [{ title: "Red Carpet & Champagne Reception", location: "Main Atrium" }],
  },
  {
    time: "08:30 PM",
    sessions: [
      { title: "Gourmet Tasting Menu", location: "Grand Dining Hall", track: "Track A" },
      { title: "Exclusive Sommelier Masterclass", location: "The Vault Room", track: "Track B" },
    ],
  },
  {
    time: "10:00 PM",
    sessions: [{ title: "Live Jazz Performance & Networking", location: "The Mezzanine Lounge" }],
  },
];

function EventAgenda() {
  return (
    <div className="bg-[#f0e6dc] p-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif text-[#3d2a2a]">Evening Agenda</h2>
        <span className="text-[#b8862f] text-sm font-semibold tracking-wider uppercase">
          Multi-Track
        </span>
      </div>

      <div className="space-y-6">
        {agendaSlots.map((slot) => (
          <div className="flex gap-6" key={slot.time}>
            <div className="w-24 shrink-0 text-[#3d2a2a] text-sm font-medium">{slot.time}</div>

            {slot.sessions.length > 1 ? (
              <div className="flex-1 grid grid-cols-2 gap-4">
                {slot.sessions.map((session) => (
                  <AgendaItem key={session.title} {...session} />
                ))}
              </div>
            ) : (
              <div className="flex-1">
                <AgendaItem {...slot.sessions[0]} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventAgenda;