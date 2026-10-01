import { X, Eye } from "lucide-react";
import { useState } from "react";

function LivePreviewSidebar({ eventData }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-24 z-40 bg-[#2d1a0e] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm hover:bg-[#3d2a2a] transition-colors"
      >
        <Eye size={16} />
        Preview
      </button>
    );
  }

  return (
    <div className="bg-[#faf7f4] border border-[#e0d6cc] rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8e0d8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#b8862f] animate-pulse" />
          <span className="text-xs font-semibold text-[#3d2a2a]">
            Patron Experience Live Preview
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[#a09080] hover:text-[#3d2a2a] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Preview card */}
      <div className="p-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#ede6de]">
          {/* Event image */}
          <div className="relative h-36 overflow-hidden">
            <img
              src={eventData.previewImage}
              alt="Event Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-[10px] uppercase tracking-widest text-[#e8c896] mb-1">
                Exclusive Invitation
              </p>
              <h3 className="text-base font-serif font-bold text-white leading-snug">
                {eventData.title || "Untitled Event"}
              </h3>
            </div>
          </div>

          {/* Event details */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-[11px]">
              <div>
                <p className="text-[#a09080] uppercase tracking-wider text-[9px] font-semibold mb-0.5">
                  Location
                </p>
                <p className="text-[#3d2a2a] font-semibold">
                  {eventData.venue}, Venice
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#a09080] uppercase tracking-wider text-[9px] font-semibold mb-0.5">
                  Commencement
                </p>
                <p className="text-[#3d2a2a] font-semibold">
                  Oct 24, 2025 · 19:30
                </p>
              </div>
            </div>

            {/* Ticket tier */}
            <div className="bg-[#faf7f4] border border-[#e8e0d8] rounded-lg p-3">
              <p className="text-xs font-semibold text-[#3d2a2a] mb-1">
                Selected Admission Tier: {eventData.selectedTier}
              </p>
              <p className="text-[10px] text-[#a09080] leading-relaxed">
                {eventData.tierDetails}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#e8e0d8] flex items-center justify-between">
        <span className="text-[10px] text-[#a09080] italic">
          Encrypted Preview Mode
        </span>
        <button className="px-4 py-2 bg-[#8b2d3a] text-white text-xs font-semibold rounded-lg hover:bg-[#6d2330] transition-colors">
          Return to Curator
        </button>
      </div>

      {/* Live preview card (mini event card) */}
      <div className="px-4 pb-4">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={eventData.previewImage}
            alt="Live Preview"
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 bg-[#c0392b] text-white text-[9px] font-bold rounded uppercase tracking-wider">
              Live Preview
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
        <div className="mt-2">
          <p className="text-[9px] text-[#a09080] uppercase tracking-wider">
            Oct 24 · Venice, IT
          </p>
          <p className="text-sm font-serif font-semibold text-[#3d2a2a] truncate mt-0.5">
            {eventData.title || "Untitled Event"}
          </p>
          <p className="text-[10px] text-[#a09080]">
            {eventData.venue} · From €850
          </p>
        </div>
      </div>
    </div>
  );
}

export default LivePreviewSidebar;
