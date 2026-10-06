import React from "react";
import AgendaItem from "./AgendaItem";

const defaultAgendaSlots = [
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

function EventAgenda({ event }) {
  const rawAgenda = event?.agenda;
  const hasCustomAgenda = Boolean(rawAgenda && rawAgenda.trim());

  let parsedItems = [];
  if (hasCustomAgenda) {
    const lines = rawAgenda.split("\n").map((l) => l.trim()).filter(Boolean);
    parsedItems = lines.map((line, idx) => {
      const match = line.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?|\d{1,2}\s*(?:AM|PM|am|pm))\s*[-–:]\s*(.+)$/i);
      if (match) {
        return {
          time: match[1].trim(),
          title: match[2].trim(),
        };
      }
      return {
        time: `Session ${idx + 1}`,
        title: line,
      };
    });
  }

  return (
    <div className="bg-[#f0e6dc] p-8 rounded-xl shadow-sm border border-[#e8dcd0]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-bold text-[#3d2a2a]">Event Program & Agenda</h2>
        <span className="text-[#b8862f] text-xs font-semibold tracking-wider uppercase bg-[#e8dcd0] px-3 py-1 rounded-full">
          {hasCustomAgenda ? "Curated Schedule" : "Multi-Track"}
        </span>
      </div>

      <div className="space-y-4">
        {hasCustomAgenda ? (
          parsedItems.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-white/70 p-4 rounded-xl border border-[#e0d0c0]">
              <div className="sm:w-28 shrink-0 text-[#8b2d3a] text-xs font-bold uppercase tracking-wider">
                {item.time}
              </div>
              <div className="flex-1 text-[#3d2a2a] text-sm font-medium">
                {item.title}
              </div>
            </div>
          ))
        ) : (
          defaultAgendaSlots.map((slot) => (
            <div className="flex gap-6" key={slot.time}>
              <div className="w-24 shrink-0 text-[#3d2a2a] text-sm font-medium">{slot.time}</div>

              {slot.sessions.length > 1 ? (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          ))
        )}
      </div>
    </div>
  );
}

export default EventAgenda;