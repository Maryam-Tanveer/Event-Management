import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EventHero({ onSearch }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activePreset, setActivePreset] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  // Quick Date Presets: Today | Weekend | 30 Days
  const handleQuickPreset = (preset) => {
    const today = new Date();
    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (activePreset === preset) {
      setActivePreset(null);
      setDateFrom("");
      setDateTo("");
      return;
    }

    setActivePreset(preset);

    if (preset === "today") {
      const todayStr = formatDate(today);
      setDateFrom(todayStr);
      setDateTo(todayStr);
    } else if (preset === "weekend") {
      const day = today.getDay(); // 0 = Sun, 6 = Sat
      const diffToSat = (6 - day + 7) % 7;
      const sat = new Date(today);
      sat.setDate(today.getDate() + diffToSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);

      setDateFrom(formatDate(sat));
      setDateTo(formatDate(sun));
    } else if (preset === "month") {
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);

      setDateFrom(formatDate(today));
      setDateTo(formatDate(nextMonth));
    }
  };

  const clearAllDates = (e) => {
    if (e) e.stopPropagation();
    setDateFrom("");
    setDateTo("");
    setActivePreset(null);
  };

  const handleFindEvents = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setShowDatePicker(false);
    if (onSearch) {
      onSearch({
        query: searchQuery.trim(),
        location: location.trim(),
        date: dateFrom && dateTo && dateFrom === dateTo ? dateFrom : "",
        dateFrom: dateFrom.trim(),
        dateTo: dateTo.trim(),
      });
    }
  };

  const getDateLabel = () => {
    if (activePreset === "today") return "Today";
    if (activePreset === "weekend") return "Weekend";
    if (activePreset === "month") return "30 Days";
    if (dateFrom && dateTo) {
      if (dateFrom === dateTo) return dateFrom;
      return `${dateFrom} → ${dateTo}`;
    }
    if (dateFrom) return `From ${dateFrom}`;
    if (dateTo) return `To ${dateTo}`;
    return "Any Date";
  };

  const hasDateSelected = Boolean(dateFrom || dateTo || activePreset);

  return (
    <section className="relative w-full">
      {/* Background Image Container with overflow hidden to clip only the background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600')",
          }}
        />
        {/* Warm Cream overlay */}
        <div className="absolute inset-0 bg-[#f5eee3]/80" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Eyebrow label */}
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
            onClick={() => {
              const el = document.getElementById("events-results");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              else navigate("/tickets");
            }}
            className="bg-[#3a0d1f] text-white px-6 py-3 font-semibold hover:bg-[#4a1428] transition-colors rounded-lg shadow-sm"
          >
            Reserve Tickets
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("events-results");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              else navigate("/tickets");
            }}
            className="bg-white/80 border border-stone-300 text-stone-900 px-6 py-3 font-semibold hover:bg-white transition-colors rounded-lg shadow-sm"
          >
            View Details
          </button>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleFindEvents}
          className="bg-white rounded-xl shadow-xl p-3 flex flex-col md:flex-row gap-3 relative z-30"
        >
          {/* 1. Keyword search input */}
          <div className="flex items-center gap-2.5 bg-[#fbeed9] px-4 py-3 flex-1 rounded-lg">
            <Search className="w-5 h-5 text-stone-500 shrink-0" />
            <input
              type="text"
              name="searchQuery"
              placeholder="Search events, artists, or venues"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* 2. Location search input */}
          <div className="flex items-center gap-2.5 bg-[#fbeed9] px-4 py-3 flex-1 rounded-lg">
            <MapPin className="w-5 h-5 text-stone-500 shrink-0" />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent outline-none w-full placeholder:text-stone-500 text-stone-800 text-sm font-medium"
            />
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
              <div className="flex items-center gap-1.5 shrink-0">
                {hasDateSelected && (
                  <span
                    onClick={clearAllDates}
                    role="button"
                    tabIndex={0}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
                    title="Clear date"
                  >
                    <X size={14} />
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`text-stone-500 transition-transform ${
                    showDatePicker ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Calendar Popover matching Image 2, opens upwards so it does NOT overlap events below */}
            {showDatePicker && (
              <div className="absolute bottom-full left-0 right-0 sm:left-auto sm:right-0 mb-3 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                {/* Decorative caret pointing to the trigger button */}
                <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white border-b border-r border-stone-200 rotate-45 hidden sm:block" />

                {/* 1. Quick Presets: Today | Weekend | 30 Days */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => handleQuickPreset("today")}
                    className={`py-2 px-2 rounded-md border text-sm font-medium transition-colors text-center ${
                      activePreset === "today"
                        ? "bg-[#3a0d1f] text-white border-[#3a0d1f]"
                        : "bg-white border-stone-200 text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset("weekend")}
                    className={`py-2 px-2 rounded-md border text-sm font-medium transition-colors text-center ${
                      activePreset === "weekend"
                        ? "bg-[#3a0d1f] text-white border-[#3a0d1f]"
                        : "bg-white border-stone-200 text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    Weekend
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset("month")}
                    className={`py-2 px-2 rounded-md border text-sm font-medium transition-colors text-center ${
                      activePreset === "month"
                        ? "bg-[#3a0d1f] text-white border-[#3a0d1f]"
                        : "bg-white border-stone-200 text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    30 Days
                  </button>
                </div>

                {/* 2. FROM DATE */}
                <div className="mb-4">
                  <label className="block font-serif text-xs font-bold text-stone-700 tracking-wider uppercase mb-1.5">
                    FROM DATE
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setActivePreset(null);
                    }}
                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#3a0d1f] focus:border-[#3a0d1f] transition-all cursor-pointer"
                  />
                </div>

                {/* 3. TO DATE */}
                <div className="mb-3">
                  <label className="block font-serif text-xs font-bold text-stone-700 tracking-wider uppercase mb-1.5">
                    TO DATE
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setActivePreset(null);
                    }}
                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#3a0d1f] focus:border-[#3a0d1f] transition-all cursor-pointer"
                  />
                </div>

                {/* 4. Action buttons: Reset & Apply */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  {hasDateSelected ? (
                    <button
                      type="button"
                      onClick={clearAllDates}
                      className="text-xs text-stone-500 hover:text-stone-800 font-medium hover:underline"
                    >
                      Reset
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="bg-[#3a0d1f] text-white px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-[#4a1428] transition-colors shadow-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Find Events button */}
          <button
            type="submit"
            className="bg-[#3a0d1f] text-white px-8 py-3.5 font-bold tracking-wider hover:bg-[#4a1428] transition-colors whitespace-nowrap rounded-lg shadow-md uppercase text-xs"
          >
            Find Events
          </button>
        </form>
      </div>
    </section>
  );
}

export default EventHero;