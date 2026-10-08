import React from "react";
import EventCard from "./EventCard";

function EventsGrid({ events, onLoadMore, hasMore, onResetFilters }) {
  // Empty state — agar filters lagane ke baad koi event na bache
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center my-6 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#f5e6d8] flex items-center justify-center mx-auto mb-4 text-[#8C6B45] text-2xl">
          🔍
        </div>
        <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">No Matching Events Found</h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
          We couldn't find any events matching your selected filters. Try broadening your search or resetting all filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 bg-[#3d1823] text-white text-xs font-semibold rounded-full hover:bg-[#2c1119] transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Button sirf tab dikhega jab aur events bache hon */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-2.5 text-sm rounded-full border border-stone-300 text-stone-700 hover:bg-white transition-colors"
          >
            Load More Events
          </button>
        </div>
      )}
    </>
  );
}

export default EventsGrid;