import React from "react";
import AgendaItem from "./AgendaItem";

// ✅ Ab agendaSlots event se prop ke zariye aate hain — hardcoded nahi
function EventAgenda({ agendaSlots = [] }) {

  // Agar event me agenda nahi hai — kuch mat dikho
  if (!agendaSlots || agendaSlots.length === 0) return null;

  return (
    <div className="bg-[#f0e6dc] p-8 rounded-xl shadow-sm border border-[#e8dcd0]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif text-[#3d2a2a]">Event Agenda</h2>
        {agendaSlots.some((s) => s.sessions?.length > 1) && (
          <span className="text-[#b8862f] text-sm font-semibold tracking-wider uppercase">
            Multi-Track
          </span>
        )}
      </div>

      <div className="space-y-6">
        {agendaSlots.map((slot, idx) => (
          <div className="flex gap-6" key={idx}>
            <div className="w-24 shrink-0 text-[#3d2a2a] text-sm font-medium">
              {slot.time}
            </div>

            {slot.sessions?.length > 1 ? (
              <div className="flex-1 grid grid-cols-2 gap-4">
                {slot.sessions.map((session, sIdx) => (
                  <AgendaItem key={sIdx} {...session} />
                ))}
              </div>
            ) : (
              <div className="flex-1">
                <AgendaItem {...(slot.sessions?.[0] || {})} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventAgenda;