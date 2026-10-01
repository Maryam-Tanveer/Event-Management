import React from "react";
import { Edit2, Trash2, Plus, Calendar, MapPin, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OrganizerEvents({ events, loading, onDelete, onEdit }) {
  const navigate = useNavigate();

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-semibold text-gray-900">My Events</h2>
        <button
          onClick={() => navigate("/organize")}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#3d1823] text-white text-xs font-semibold rounded-full hover:bg-[#2c1119] transition-colors"
        >
          <Plus size={13} />
          New Event
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#8b2d3a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && events.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-500 mb-4">
            You haven't created any events yet.
          </p>
          <button
            onClick={() => navigate("/organize")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3d1823] text-white text-xs font-semibold rounded-full hover:bg-[#2c1119] transition-colors"
          >
            <Plus size={13} />
            Create Your First Event
          </button>
        </div>
      )}

      {/* Events list */}
      {!loading && events.length > 0 && (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 items-start hover:shadow-sm transition-shadow"
            >
              {/* Event image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                {event.previewImage ? (
                  <img
                    src={event.previewImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f5e6d8] flex items-center justify-center">
                    <Calendar size={20} className="text-[#b8862f]" />
                  </div>
                )}
              </div>

              {/* Event details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 truncate">
                  {event.title}
                </h3>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
                  {event.startDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {event.startDate}
                      {event.startTime && ` · ${event.startTime}`}
                    </span>
                  )}
                  {event.venue && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {event.venue}
                    </span>
                  )}
                  {event.category && (
                    <span className="flex items-center gap-1">
                      <Tag size={11} />
                      {event.category}
                    </span>
                  )}
                </div>

                {/* Price badge */}
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f5e6d8] text-[#8C6B45]">
                  {event.price === 0 ? "FREE" : `$${event.price}`}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => onEdit(event)}
                  title="Edit event"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3d2a2a] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(event._id, event.title)}
                  title="Delete event"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrganizerEvents;
