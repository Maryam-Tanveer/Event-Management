

import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

 function EventHero( { onSearch }) {
  const navigate = useNavigate();
  // Ye teeno states search bar ke teeno inputs ki value store karte hain
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  // Jab "Find Events" button click hoga ye function chalega
 const handleFindEvents = () => {
    onSearch({ query: searchQuery, location, date });
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
            onClick={() => navigate("/tickets")}
            className="bg-[#3a0d1f] text-white px-6 py-3 font-semibold hover:bg-[#4a1428] transition-colors"
          >
            Reserve Tickets
          </button>
          <button 
            onClick={() => navigate("/tickets")}
            className="bg-white/70 border border-stone-400 text-stone-900 px-6 py-3 font-semibold hover:bg-white transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-md shadow-lg p-3 flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="flex items-center gap-2 bg-[#fbeed9] px-4 py-3 flex-1">
            <Search className="w-5 h-5 text-stone-500" />
            <input
              type="text"
              placeholder="Search events, artists, or venues"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full placeholder:text-stone-500 text-stone-800"
            />
          </div>

          {/* Location input */}
          <div className="flex items-center gap-2 bg-[#fbeed9] px-4 py-3 flex-1">
            <MapPin className="w-5 h-5 text-stone-500" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent outline-none w-full placeholder:text-stone-500 text-stone-800"
            />
          </div>

          {/* Date input */}
          <div className="flex items-center gap-2 bg-[#fbeed9] px-4 py-3 flex-1">
            <Calendar className="w-5 h-5 text-stone-500" />
            <input
              type="text"
              placeholder="Any Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent outline-none w-full placeholder:text-stone-500 text-stone-800"
            />
          </div>

          {/* Find Events button */}
          <button
            onClick={handleFindEvents}
            className="bg-[#3a0d1f] text-white px-8 py-3 font-semibold hover:bg-[#4a1428] transition-colors whitespace-nowrap"
          >
            Find Events
          </button>
        </div>
      </div>
    </section>
  );
}
export default EventHero;