import { X, Plus, Tag, DollarSign } from "lucide-react";
import { useState } from "react";

// Consistent with discovery filters in EventPage
const EVENT_CATEGORIES = [
  "Conferences",
  "Galas & Soirées",
  "Concerts",
  "Art & Exhibitions",
  "Workshops",
  "Networking",
  "Sports",
  "Other",
];

function FoundationSection({ eventData, setEventData }) {
  const [newTag, setNewTag] = useState("");
  // isFree toggle — agar true hai toh price input disable aur 0 set ho jaayega
  const [isFree, setIsFree] = useState(
    eventData.price === 0 || eventData.price === "" || eventData.price === "0"
  );

  const removeTag = (tagToRemove) => {
    setEventData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !eventData.tags.includes(newTag.trim())) {
      setEventData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleFreeToggle = () => {
    const newIsFree = !isFree;
    setIsFree(newIsFree);
    if (newIsFree) {
      // Free toggle on → price 0 set karo
      setEventData((prev) => ({ ...prev, price: 0 }));
    } else {
      // Free toggle off → price blank karo taaki user type kare
      setEventData((prev) => ({ ...prev, price: "" }));
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-[#e8e0d8] p-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#b8862f] uppercase">
          01 / Foundation
        </h3>
        <span className="text-xs text-[#a09080] italic">Editorial Core</span>
      </div>

      {/* Event Title */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#3d2a2a] mb-2">
          Event Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={eventData.title}
          onChange={(e) =>
            setEventData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-4 py-3 bg-[#2d1a0e] text-white rounded-lg text-lg font-serif placeholder-[#8a7a6a] focus:outline-none focus:ring-2 focus:ring-[#b8862f]"
          placeholder="Enter event title..."
        />
        <p className="text-[11px] text-[#a09080] mt-1.5 italic">
          Reflects your event's prestige across personalized patron invitations.
        </p>
      </div>

      {/* ── NEW: Category + Price — two columns ── */}
      {/* ❌ Pehle: ye fields form mein the hi nahi */}
      {/* ✅ Ab: organizer apni category aur price set kar sakta hai */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-[#3d2a2a] mb-2">
            <span className="flex items-center gap-1.5">
              <Tag size={13} className="text-[#b8862f]" />
              Event Category <span className="text-red-400">*</span>
            </span>
          </label>
          <select
            value={eventData.category || ""}
            onChange={(e) =>
              setEventData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full px-4 py-3 border border-[#e0d6cc] rounded-lg text-sm text-[#3d2a2a] bg-[#faf7f4] focus:outline-none focus:ring-2 focus:ring-[#b8862f] appearance-none cursor-pointer"
          >
            <option value="" disabled>Select a category...</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <p className="text-[11px] text-[#a09080] mt-1.5 italic">
            Helps attendees discover your event by type.
          </p>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-semibold text-[#3d2a2a] mb-2">
            <span className="flex items-center gap-1.5">
              <DollarSign size={13} className="text-[#b8862f]" />
              Ticket Price
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a09080] text-sm font-medium pointer-events-none">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={isFree ? "" : (eventData.price ?? "")}
              onChange={(e) => {
                const val = e.target.value;
                setEventData((prev) => ({
                  ...prev,
                  price: val === "" ? "" : parseFloat(val) || 0,
                }));
              }}
              disabled={isFree}
              placeholder={isFree ? "Free" : "0.00"}
              className={`w-full pl-8 pr-4 py-3 border border-[#e0d6cc] rounded-lg text-sm text-[#3d2a2a] bg-[#faf7f4] focus:outline-none focus:ring-2 focus:ring-[#b8862f] transition-opacity ${
                isFree ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Free event toggle */}
          <button
            type="button"
            onClick={handleFreeToggle}
            className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
              isFree
                ? "bg-[#4a1f2b] text-white border-[#4a1f2b]"
                : "bg-transparent text-[#a09080] border-[#e0d6cc] hover:border-[#b8862f] hover:text-[#b8862f]"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isFree ? "bg-white" : "bg-[#a09080]"}`} />
            Free Event
          </button>
          <p className="text-[11px] text-[#a09080] mt-1 italic">
            Per-ticket price shown to attendees.
          </p>
        </div>
      </div>

      {/* Categorization & Tags */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#3d2a2a] mb-3">
          Curated Disciplines & Tags
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {eventData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4a1f2b] text-white text-xs rounded-full font-medium"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-[#e8c896] transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <div className="inline-flex items-center gap-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add Tag"
              className="w-20 px-2 py-1.5 text-xs border border-dashed border-[#c9bfb3] rounded-full text-[#3d2a2a] placeholder-[#a09080] focus:outline-none focus:border-[#b8862f] bg-transparent"
            />
            <button
              onClick={addTag}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-dashed border-[#c9bfb3] text-[#a09080] hover:border-[#b8862f] hover:text-[#b8862f] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-[#a09080] mt-1.5 italic">
          Tags help surface your event in curated searches.
        </p>
      </div>

      {/* Editorial Synopsis */}
      <div>
        <label className="block text-sm font-semibold text-[#3d2a2a] mb-2">
          Editorial Synopsis & Narrative <span className="text-red-400">*</span>
        </label>
        <textarea
          value={eventData.synopsis}
          onChange={(e) =>
            setEventData((prev) => ({ ...prev, synopsis: e.target.value }))
          }
          rows={4}
          className="w-full px-4 py-3 border border-[#e0d6cc] rounded-lg text-sm text-[#3d2a2a] leading-relaxed placeholder-[#a09080] focus:outline-none focus:ring-2 focus:ring-[#b8862f] resize-none bg-[#faf7f4]"
          placeholder="Describe the event narrative..."
        />
      </div>
    </section>
  );
}

export default FoundationSection;
