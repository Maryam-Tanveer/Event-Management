

import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
function EventHero({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Jab "Find Events" button click hoga ye function chalega
  const handleFindEvents = () => {
    onSearch({ query: searchQuery, location, dateFrom, dateTo });
  };

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
      {/* Cream color overlay taake image ke upar text saaf dikhe */}
      <div className="absolute inset-0 bg-[#f5eee3]/80" />

      {/* Actual content, image ke upar */}
      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Eyebrow label */}
        <p className="text-sm tracking-[0.2em] font-semibold text-amber-700 mb-4">
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

        {/* Buttons */}
        <div className="flex gap-4 mb-10">
          <button 
            onClick={() => document.getElementById("events-results")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[#3a0d1f] text-white px-6 py-3 font-semibold hover:bg-[#4a1428] transition-colors rounded-lg shadow-sm"
          >
            Explore Events
          </button>
          <button 
            onClick={() => document.getElementById("events-results")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white/70 border border-stone-400 text-stone-900 px-6 py-3 font-semibold hover:bg-white transition-colors rounded-lg"
          >
            Browse Calendar
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="flex items-center gap-2 bg-[#fbeed9] px-4 py-3 flex-1 rounded-lg">
            <Search className="w-5 h-5 text-stone-500 shrink-0" />
            <input
              type="text"
              placeholder="Search by title, artist, or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFindEvents()}
              className="bg-transparent outline-none w-full placeholder:text-stone-500 text-stone-800 text-sm"
            />
          </div>

          {/* Location input */}
          <div className="flex items-center gap-2 bg-[#fbeed9] px-4 py-3 flex-1 rounded-lg">
            <MapPin className="w-5 h-5 text-stone-500 shrink-0" />
            <input
              type="text"
              placeholder="City, venue, or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFindEvents()}
              className="bg-transparent outline-none w-full placeholder:text-stone-500 text-stone-800 text-sm"
            />
          </div>

          {/* Date Range inputs */}
          <div className="flex items-center gap-2 bg-[#fbeed9] px-3 py-2 flex-1 rounded-lg">
            <Calendar className="w-5 h-5 text-stone-500 shrink-0" />
            <div className="flex items-center gap-2 w-full">
              <div className="flex flex-col flex-1">
                <span className="text-[9px] uppercase font-bold text-stone-500 leading-none">From</span>
                <input
                  type="date"
                  title="Start Date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFindEvents()}
                  className="bg-transparent outline-none w-full text-stone-800 text-xs cursor-pointer py-0.5"
                />
              </div>
              <span className="text-stone-300 font-bold">-</span>
              <div className="flex flex-col flex-1">
                <span className="text-[9px] uppercase font-bold text-stone-500 leading-none">To</span>
                <input
                  type="date"
                  title="End Date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFindEvents()}
                  className="bg-transparent outline-none w-full text-stone-800 text-xs cursor-pointer py-0.5"
                />
              </div>
            </div>
            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                  onSearch({ query: searchQuery, location, dateFrom: "", dateTo: "" });
                }}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline shrink-0 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Find Events button */}
          <button
            onClick={handleFindEvents}
            className="bg-[#3a0d1f] text-white px-8 py-3 font-semibold hover:bg-[#4a1428] transition-colors whitespace-nowrap rounded-lg shadow-sm"
          >
            Find Events
          </button>
        </div>
      </div>
    </section>
  );
}
export default EventHero;