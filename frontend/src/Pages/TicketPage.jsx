import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams, useParams } from "react-router-dom";
import EventGallery from "../Components/tickets/EventGallery";
import EventDescription from "../Components/tickets/EventDescription";
import EventAgenda from "../Components/tickets/EventAgenda";
import FeaturedGuests from "../Components/tickets/FeaturedGuests";
import VenueLocation from "../Components/tickets/VenueLocation";
import ReviewsSection from "../Components/tickets/ReviewsSection";
import TicketSidebar from "../Components/tickets/TicketSidebar";

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const eventIdParam = location.state?.eventId || searchParams.get("id") || routeId;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        let targetId = eventIdParam;

        // If no eventId specified (e.g. direct visit to /tickets), fetch the latest real event from DB
        if (!targetId) {
          try {
            const { data } = await axios.get("/api/events?limit=1");
            if (data.events && data.events.length > 0) {
              targetId = data.events[0]._id;
            }
          } catch (e) {
            console.warn("Could not fetch latest event for /tickets fallback", e);
          }
        }

        if (!targetId) {
          setError("No events are currently scheduled.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`/api/events/${targetId}`);

        // Backend ka structure frontend components ke liye map karo
        const mappedEvent = {
          id: data._id,
          title: data.title,
          category: data.category || "All Events",
          badge: data.tags?.[0] || "EVENT",
          image:
            data.previewImage ||
            "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop",
          galleryImages: data.galleryImages || [],
          date: data.startDate,
          time: data.startTime,
          venue: data.venue,
          location: data.city ? `${data.venue}, ${data.city}` : data.venue,
          address: data.address,
          city: data.city || "",
          coordinates: data.coordinates || null,
          format: data.format || "In-Person",
          streamUrl: data.streamUrl || "",
          priceLabel: data.price === 0 ? "Free" : `$${data.price}`,
          price: data.price || 0,
          description: data.synopsis,
          organizer: data.organizer,
          agenda: data.agenda || "",
          selectedTier: data.selectedTier || "",
          tierDetails: data.tierDetails || "",
        };
        setEvent(mappedEvent);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        if (err.response?.status === 404) {
          setError("This event could not be found.");
        } else if (err.response?.status === 400) {
          setError("Invalid event link.");
        } else {
          setError("Failed to load event. Please check your connection and try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventIdParam]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF3EC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8b2d3a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#6b4c3b] text-sm">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state — event nahi mila ya invalid ID
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#FBF3EC] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-serif font-bold text-[#2d1a0e]">Event Not Found</h2>
        <p className="text-[#6b4c3b]">{error || "This event does not exist."}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-6 py-2.5 bg-[#8b2d3a] text-white rounded-full text-sm font-semibold hover:bg-[#6d2330] transition-colors"
        >
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF3EC] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Column — Event content */}
          <div className="lg:col-span-2 space-y-10">
            <EventGallery event={event} />
            <EventDescription event={event} />
            <EventAgenda event={event} />
            <FeaturedGuests event={event} />
            <VenueLocation event={event} />
            <ReviewsSection event={event} />
          </div>

          {/* Right Column — Ticket purchase sidebar */}
          <div className="lg:col-span-1">
            <TicketSidebar event={event} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketPage;
