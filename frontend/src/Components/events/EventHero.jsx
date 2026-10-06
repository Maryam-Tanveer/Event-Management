import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, X, ChevronDown, Check } from "lucide-react";

function EventHero({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateMode, setActiveDateMode] = useState("any"); // "any", "single", "range"
  const datePickerRef = useRef(null);

  // Close calendar popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quick Date Preset Handler
  const handleQuickPreset = (preset) => {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split("T")[0];

    if (preset === "any") {
      setDate("");
      setDateFrom("");
      setDateTo("");
      setActiveDateMode("any");
    } else if (preset === "today") {
      const todayStr = formatDate(today);
      setDate(todayStr);
      setDateFrom("");
      setDateTo("");
      setActiveDateMode("single");
    } else if (preset === "weekend") {
      const day = today.getDay();
      const diffToSat = (6 - day + 7) % 7;
      const sat = new Date(today);
      sat.setDate(today.getDate() + diffToSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);

      setDate("");
      setDateFrom(formatDate(sat));
      setDateTo(formatDate(sun));
      setActiveDateMode("range");
    } else if (preset === "month") {
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);

      setDate("");
      setDateFrom(formatDate(today));
      setDateTo(formatDate(nextMonth));
      setActiveDateMode("range");
    }
  };

  const clearAllDates = () => {
    setDate("");
    setDateFrom("");
    setDateTo("");
    setActiveDateMode("any");
  };

  const handleFindEvents = () => {
    setShowDatePicker(false);
    onSearch({
      query: searchQuery.trim(),
      location: location.trim(),
      date: date.trim(),
      dateFrom: dateFrom.trim(),
      dateTo: dateTo.trim(),
    });
  };

  // Human-readable date label for the trigger button
  const getDateLabel = () => {
    if (date) return date;
    if (dateFrom && dateTo) return `${dateFrom} → ${dateTo}`;
    if (dateFrom) return `From ${dateFrom}`;
    if (dateTo) return `Until ${dateTo}`;
    return "Any Date";
  };

  const hasDateSelected = Boolean(date || dateFrom || dateTo);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600')",
        }}
      />
      {/* Warm Cream overlay */}
      <div className="absolute inset-0 bg-[#f5eee3]/80" />

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Eyebrow */}
        <p className="text-sm tracking-[0.2em] font-semibold text-amber-700 mb-4 uppercase">
          FEATURED EVENT
        </p>

        {/* Heading */}
        <h1 className="font-serif text-5xl md:text-6xl leading-tight text-stone-900 mb-6">
          The Annual
          <br />
          Gala of Elegance
        </h1>

        {/* Description */}
        <p className="text-stone-700 max-w-xl mb-8 leading-relaxed">
          An exclusive evening of fine dining, networking, and celebration at
          the Grand Plaza Hotel.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() =>
              document.getElementById("events-results")?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[#3a0d1f] text-white px-6 py-3 font-semibold hover:bg-[#4a1428] transition-colors rounded-lg shadow-sm"
          >
            Reserve Tickets
          </button>
          <button
            onClick={() =>
              document.getElementById("events-results")?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white/80 border border-stone-300 text-stone-900 px-6 py-3 font-semibold hover:bg-white transition-colors rounded-lg shadow-sm"
          >
            View Details
          </button>
        </div>

        {/* ══ HERO SEARCH BAR ══ */}
        <div className="bg-white rounded-xl shadow-xl p-3 flex flex-col md:flex-row gap-3 relative z-30">
          {/* 1. Keyword search input */}
          <div className="flex items-center gap-2.5 bg-[#fbeed9] px-4 py-3 flex-1 rounded-lg">
            <Search className="w-5 h-5 text-stone-500 shrink-0" />
            <input
              type="text"
              placeholder="Search events, artists, or venue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFindEvents()}
              className="bg-transparent outline-none w-full placeholder:text-stone-500 text-stone-800 text-sm font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-stone-400 hover:text-stone-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* 2. Location search input with quick suggestions */}
          <div className="flex items-center gap-2.5 bg-[#fbeed9] px-4 py-3 flex-1 rounded-lg">
            <MapPin className="w-5 h-5 text-stone-500 shrink-0" />
            <input
              type="text"
              list="location-options"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFindEvents()}
              className="bg-transparent outline-none w-full placeholder:text-stone-500 text-stone-800 text-sm font-medium"
            />
            <datalist id="location-options">
              <option value="New York" />
              <option value="San Francisco" />
              <option value="Chicago" />
              <option value="Venice" />
              <option value="Montalcino" />
            </datalist>
            {location && (
              <button
                type="button"
                onClick={() => setLocation("")}
                className="text-stone-400 hover:text-stone-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* 3. Interactive Calendar Date Trigger & Popover */}
          <div className="relative flex-1" ref={datePickerRef}>
            <button
              type="button"
              onClick={() => setShowDatePicker((prev) => !prev)}
              className={`w-full h-full flex items-center justify-between gap-2 bg-[#fbeed9] px-4 py-3 rounded-lg text-left transition-all ${
                showDatePicker ? "ring-2 ring-[#3a0d1f]" : ""
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Calendar className="w-5 h-5 text-stone-500 shrink-0" />
                <span
                  className={`text-sm truncate font-medium ${
                    hasDateSelected ? "text-[#3a0d1f] font-semibold" : "text-stone-700"
                  }`}
                >
                  {getDateLabel()}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {hasDateSelected && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllDates();
                    }}
                    role="button"
                    tabIndex={0}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
                    title="Clear date"
                  >
                    <X size={14} />
                  </span>
                )}
                <ChevronDown size={16} className="text-stone-500" />
              </div>
            </button>

            {/* Calendar Popover */}
            {showDatePicker && (
              <div className="absolute top-full left-0 right-0 md:w-80 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#b8862f]" /> Select Date
                  </span>
                  {hasDateSelected && (
                    <button
                      type="button"
                      onClick={clearAllDates}
                      className="text-xs text-amber-700 hover:underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 gap-1.5 mb-4">
                  {[
                    { key: "any", label: "Any Date" },
                    { key: "today", label: "Today" },
                    { key: "weekend", label: "This Weekend" },
                    { key: "month", label: "Next 30 Days" },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleQuickPreset(p.key)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left transition-colors flex items-center justify-between ${
                        activeDateMode === p.key
                          ? "bg-[#3a0d1f] text-white border-[#3a0d1f]"
                          : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <span>{p.label}</span>
                      {activeDateMode === p.key && <Check size={12} />}
                    </button>
                  ))}
                </div>

                {/* Date Selection Modes: Single Date or Date Range */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Specific Event Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setDateFrom("");
                        setDateTo("");
                        setActiveDateMode("single");
                      }}
                      className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[#3a0d1f]"
                    />
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Or Date Range
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="block text-[10px] text-stone-500 font-semibold mb-0.5">FROM</span>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => {
                            setDateFrom(e.target.value);
                            setDate("");
                            setActiveDateMode("range");
                          }}
                          className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[#3a0d1f]"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-500 font-semibold mb-0.5">TO</span>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => {
                            setDateTo(e.target.value);
                            setDate("");
                            setActiveDateMode("range");
                          }}
                          className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[#3a0d1f]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="w-full mt-4 bg-[#3a0d1f] text-white py-2 rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-[#4a1428] transition-colors"
                >
                  Confirm Date
                </button>
              </div>
            )}
          </div>

          {/* 4. Find Events button */}
          <button
            onClick={handleFindEvents}
            className="bg-[#3a0d1f] text-white px-8 py-3.5 font-bold tracking-wider hover:bg-[#4a1428] transition-colors whitespace-nowrap rounded-lg shadow-md uppercase text-xs"
          >
            Find Events
          </button>
        </div>
      </div>
    </section>
  );
}

export default EventHero;