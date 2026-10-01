import React from "react";
import EventCard from "./EventCard";

function EventsGrid({ events, onLoadMore, hasMore }) {
  // Empty state — agar filters lagane ke baad koi event na bache
  if (events.length === 0) {
    return (
      <div className="text-center text-stone-500 text-sm py-16">
        No events match the selected filters.
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