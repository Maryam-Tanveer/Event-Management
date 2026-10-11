import React from "react";

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 flex flex-col animate-pulse shadow-sm">
      <div className="h-40 bg-stone-200 relative">
        <div className="absolute top-3 right-3 w-16 h-5 bg-stone-300 rounded-full" />
      </div>
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="h-3 w-1/3 bg-stone-200 rounded" />
        <div className="h-4 w-3/4 bg-stone-200 rounded" />
        <div className="h-3 w-1/2 bg-stone-200 rounded" />
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="h-4 w-14 bg-stone-200 rounded" />
          <div className="w-8 h-8 rounded-full bg-stone-200" />
        </div>
      </div>
    </div>
  );
}

export function EventsGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <EventCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export default EventCardSkeleton;
