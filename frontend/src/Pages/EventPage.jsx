import React, { useState, useEffect, useCallback } from "react";
import EventHero from "../Components/events/EventHero";
import Sidebar from "../Components/events/Sidebar";
import EventsHeader from "../Components/events/EventsHeader";
import EventsGrid from "../Components/events/EventsGrid";
import { mockEvents } from "../data/mockEvents";
import axiosInstance from "../api/axiosInstance";

const PRICE_MAP = {
  free:     { priceMin: 0, priceMax: 0 },
  under50:  { priceMin: 0, priceMax: 49 },
  "50to150":{ priceMin: 50, priceMax: 150 },
  "150plus":{ priceMin: 151, priceMax: undefined },
  any:      {},
};

function EventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);


  const [category, setCategory] = useState("All Events");
  const [priceKey, setPriceKey] = useState("any");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const getFilteredMockEvents = () => {
    let filteredMock = [...mockEvents];
    if (category !== "All Events") {
      filteredMock = filteredMock.filter(e => e.category === category);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredMock = filteredMock.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q))
      );
    }
    if (location.trim()) {
      const l = location.toLowerCase();
      filteredMock = filteredMock.filter(e => e.location.toLowerCase().includes(l));
    }
    if (date.trim()) {
      const d = date.toLowerCase();
      filteredMock = filteredMock.filter(e => e.date && e.date.toLowerCase().includes(d));
    }
    if (dateFrom.trim()) {
      filteredMock = filteredMock.filter(e => !e.date || e.date >= dateFrom);
    }
    if (dateTo.trim()) {
      filteredMock = filteredMock.filter(e => !e.date || e.date <= dateTo);
    }
    const pParams = PRICE_MAP[priceKey] || {};
    if (pParams.priceMin !== undefined) {
      filteredMock = filteredMock.filter(e => e.price >= pParams.priceMin);
    }
    if (pParams.priceMax !== undefined) {
      filteredMock = filteredMock.filter(e => e.price <= pParams.priceMax);
    }
    return filteredMock;
  };

  const fetchEvents = useCallback(async (currentPage = 1, append = false) => {
    try {
      setLoading(true);
      const priceParams = PRICE_MAP[priceKey] || {};
      const params = {
        page: currentPage,
        limit: 9,
        sortBy,
        ...(category !== "All Events" && { category }),
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
        ...(location.trim() && { location: location.trim() }),
        ...(date.trim() && { date: date.trim() }),
        ...(dateFrom.trim() && { dateFrom: dateFrom.trim() }),
        ...(dateTo.trim() && { dateTo: dateTo.trim() }),
        ...priceParams,
      };

      const { data } = await axiosInstance.get("/api/events", { params });

      if (data.totalCount === 0 && currentPage === 1) {
        setEvents(getFilteredMockEvents());
        setHasMore(false);
      } else {

        const mapped = data.events.map((e) => ({
          id: e._id,
          title: e.title,
          category: e.category || "All Events",
          badge: e.tags?.[0]?.toUpperCase() || "EVENT",
          image: e.previewImage || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop",
          date: e.startDate,
          time: e.startTime,
          location: e.venue,
          priceLabel: e.price === 0 ? "Free" : `$${e.price}`,
          price: e.price || 0,
          description: e.synopsis,
        }));
        setEvents((prev) => (append ? [...prev, ...mapped] : mapped));
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
      setEvents(getFilteredMockEvents());
      setHasMore(false);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, priceKey, sortBy, searchQuery, location, date, dateFrom, dateTo]);

  // Re-fetch when filters change — reset to page 1
  useEffect(() => {
    setPage(1);
    fetchEvents(1, false);
  }, [fetchEvents]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage, true);
  };

  const handleSearch = ({ query, location, date, dateFrom: df, dateTo: dt2 }) => {
    if (query !== undefined) setSearchQuery(query);
    if (location !== undefined) setLocation(location);
    if (date !== undefined) setDate(date);
    if (df !== undefined) setDateFrom(df);
    if (dt2 !== undefined) setDateTo(dt2);
    document.getElementById("events-results")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#FBF3EC]">
      <EventHero onSearch={handleSearch} />

      <div id="events-results" className="px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
          <Sidebar
            category={category}
            setCategory={setCategory}
            priceKey={priceKey}
            setPriceKey={setPriceKey}
          />

          <main className="flex-1">
            <EventsHeader sortBy={sortBy} setSortBy={setSortBy} />
            {searchQuery && (
              <p className="text-sm text-stone-500 mb-4">
                Showing results for "<span className="font-medium text-stone-800">{searchQuery}</span>"
              </p>
            )}
            {loading && events.length === 0 ? (
              <div className="text-center text-stone-500 py-16">Loading events...</div>
            ) : (
              <EventsGrid
                events={events}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default EventPage;

