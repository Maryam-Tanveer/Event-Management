import React, { useState, useEffect, useCallback } from "react";
import EventHero from "../Components/events/EventHero";
import Sidebar from "../Components/events/Sidebar";
import EventsHeader from "../Components/events/EventsHeader";
import EventsGrid from "../Components/events/EventsGrid";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const PRICE_MAP = {
  free:     { priceMin: 0, priceMax: 0 },
  under50:  { priceMin: 0, priceMax: 50 },
  "50to150":{ priceMin: 50, priceMax: 150 },
  "150plus":{ priceMin: 150 },
  any:      {},
};

function EventPage() {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Initialize from URL parameters or defaults
  const [category, setCategory] = useState(() => searchParams.get("category") || "All Events");
  const [priceKey, setPriceKey] = useState(() => searchParams.get("price") || "any");
  const [sortBy, setSortBy] = useState(() => searchParams.get("sortBy") || "relevance");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [location, setLocation] = useState(() => searchParams.get("location") || "");
  const [date, setDate] = useState(() => searchParams.get("date") || "");
  const [dateFrom, setDateFrom] = useState(() => searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(() => searchParams.get("dateTo") || "");

  // Sync state if URL query params change (e.g. category button clicked in Footer)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat !== category) setCategory(cat);

    const q = searchParams.get("search");
    if (q !== null && q !== searchQuery) setSearchQuery(q);

    const loc = searchParams.get("location");
    if (loc !== null && loc !== location) setLocation(loc);

    const dt = searchParams.get("date");
    if (dt !== null && dt !== date) setDate(dt);

    const df = searchParams.get("dateFrom");
    if (df !== null && df !== dateFrom) setDateFrom(df);

    const dt2 = searchParams.get("dateTo");
    if (dt2 !== null && dt2 !== dateTo) setDateTo(dt2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

      const { data } = await axios.get("/api/events", { params });

      const mapped = (data.events || []).map((e) => ({
        id: e._id,
        title: e.title,
        category: e.category || "All Events",
        badge: e.tags?.[0]?.toUpperCase() || "EVENT",
        image: e.previewImage || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop",
        date: e.startDate,
        time: e.startTime,
        location: e.city ? `${e.venue}, ${e.city}` : e.venue,
        venue: e.venue,
        address: e.address,
        city: e.city,
        coordinates: e.coordinates,
        priceLabel: e.price === 0 ? "Free" : `$${e.price}`,
        price: e.price || 0,
        description: e.synopsis,
      }));

      setEvents((prev) => (append ? [...prev, ...mapped] : mapped));
      setHasMore(data.hasMore || false);
    } catch (err) {
      console.error("Failed to fetch events from backend:", err);
      if (currentPage === 1) {
        setEvents([]);
      }
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

  const handleSearch = ({ query, location: loc, date: dt, dateFrom: df, dateTo: dt2 }) => {
    if (query !== undefined) setSearchQuery(query);
    if (loc !== undefined) setLocation(loc);
    if (dt !== undefined) setDate(dt);
    if (df !== undefined) setDateFrom(df);
    if (dt2 !== undefined) setDateTo(dt2);
    document.getElementById("events-results")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setCategory("All Events");
    setPriceKey("any");
    setSearchQuery("");
    setLocation("");
    setDate("");
    setDateFrom("");
    setDateTo("");
    setSortBy("relevance");
  };

  const hasAnyFilterActive =
    category !== "All Events" ||
    priceKey !== "any" ||
    searchQuery.trim() !== "" ||
    location.trim() !== "" ||
    date.trim() !== "" ||
    dateFrom.trim() !== "" ||
    dateTo.trim() !== "";

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
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            onReset={handleResetFilters}
          />

          <main className="flex-1">
            <EventsHeader sortBy={sortBy} setSortBy={setSortBy} />

            {/* Active filter badges bar */}
            {hasAnyFilterActive && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white/70 border border-stone-200 rounded-xl">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mr-1">
                  Active:
                </span>
                {category !== "All Events" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5e6d8] text-[#3d2a2a] text-xs font-medium rounded-full">
                    Category: {category}
                    <button onClick={() => setCategory("All Events")} className="hover:text-red-600 font-bold">×</button>
                  </span>
                )}
                {priceKey !== "any" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5e6d8] text-[#3d2a2a] text-xs font-medium rounded-full">
                    Price: {priceKey}
                    <button onClick={() => setPriceKey("any")} className="hover:text-red-600 font-bold">×</button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5e6d8] text-[#3d2a2a] text-xs font-medium rounded-full">
                    Keyword: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-red-600 font-bold">×</button>
                  </span>
                )}
                {location.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5e6d8] text-[#3d2a2a] text-xs font-medium rounded-full">
                    Location: "{location}"
                    <button onClick={() => setLocation("")} className="hover:text-red-600 font-bold">×</button>
                  </span>
                )}
                {date.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5e6d8] text-[#3d2a2a] text-xs font-medium rounded-full">
                    Date: {date}
                    <button onClick={() => setDate("")} className="hover:text-red-600 font-bold">×</button>
                  </span>
                )}
                {(dateFrom.trim() || dateTo.trim()) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5e6d8] text-[#3d2a2a] text-xs font-medium rounded-full">
                    Range: {dateFrom || "Any"} → {dateTo || "Any"}
                    <button onClick={() => { setDateFrom(""); setDateTo(""); }} className="hover:text-red-600 font-bold">×</button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="ml-auto text-xs text-orange-800 hover:text-orange-950 font-semibold underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {loading && events.length === 0 ? (
              <div className="text-center text-stone-500 py-16 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#8b2d3a] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm">Finding events...</p>
              </div>
            ) : (
              <EventsGrid
                events={events}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                onResetFilters={handleResetFilters}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default EventPage;

