import React from "react";
import { ChevronDown } from "lucide-react";

function EventsHeader({ sortBy, setSortBy }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-stone-900">
        Upcoming Experiences
      </h2>

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none text-sm border border-stone-200 rounded-full pl-4 pr-8 py-1.5 text-stone-600 bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
          <option value="relevance">Relevance</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400"
        />
      </div>
    </div>
  );
}

export default EventsHeader;