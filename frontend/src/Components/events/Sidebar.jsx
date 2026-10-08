import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { priceOptions } from "../../data/mockEvents";

function Sidebar({ category, setCategory, priceKey, setPriceKey }) {
  // ✅ Categories DB se fetch hoti hain — hardcoded nahi
  const [categoryOptions, setCategoryOptions] = useState(["All Events"]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/api/events/categories");
        if (Array.isArray(data) && data.length > 0) {
          setCategoryOptions(data);
        }
      } catch {
        // Fallback to "All Events" only
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <aside className="w-full lg:w-56 flex-shrink-0">
      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-stone-900 mb-3">Categories</h4>
        <div className="flex flex-col gap-2">
          {loadingCats ? (
            // Skeleton loading
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="h-4 bg-stone-100 rounded animate-pulse w-3/4" />
            ))
          ) : (
            categoryOptions.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                  className="rounded border-stone-300 text-orange-700 focus:ring-orange-600"
                />
                {cat}
              </label>
            ))
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-stone-900 mb-3">Price Range</h4>
        <div className="flex flex-col gap-2">
          {priceOptions.map((p) => (
            <label
              key={p.key}
              className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {priceOptions.map((p) => {
            const isSelected = priceKey === p.key;
            return (
              <label
                key={p.key}
                onClick={(e) => {
                  // Toggle off back to "any" if clicking the already selected price option
                  if (isSelected && p.key !== "any") {
                    e.preventDefault();
                    setPriceKey("any");
                  }
                }}
                className={`flex items-center gap-2.5 text-xs cursor-pointer py-1.5 px-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#f5e6d8] text-[#3d1823] font-semibold"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <input
                  type="radio"
                  name="price"
                  checked={isSelected}
                  onChange={() => setPriceKey(isSelected ? "any" : p.key)}
                  className="border-stone-300 text-amber-800 focus:ring-amber-700 cursor-pointer"
                />
                <span className="flex-1">{p.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Date Range Selector & Calendar Inputs */}
      <div className="bg-[#fdfaf7] border border-stone-200 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
            <Calendar size={13} className="text-[#b8862f]" />
            Date Range
          </h4>
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => handleQuickDate("clear")}
              className="text-[11px] text-amber-800 hover:underline font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Date Presets */}
        <div className="grid grid-cols-3 gap-1 mb-3">
          <button
            type="button"
            onClick={() => handleQuickDate("today")}
            className="text-[10px] font-medium py-1 px-1.5 rounded bg-white border border-stone-200 hover:border-[#b8862f] text-stone-700 transition-colors text-center"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate("weekend")}
            className="text-[10px] font-medium py-1 px-1.5 rounded bg-white border border-stone-200 hover:border-[#b8862f] text-stone-700 transition-colors text-center"
          >
            Weekend
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate("month")}
            className="text-[10px] font-medium py-1 px-1.5 rounded bg-white border border-stone-200 hover:border-[#b8862f] text-stone-700 transition-colors text-center"
          >
            30 Days
          </button>
        </div>

        {/* Calendar Date Inputs */}
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom || ""}
              onChange={(e) => setDateFrom && setDateFrom(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-[#b8862f]"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">
              To Date
            </label>
            <input
              type="date"
              value={dateTo || ""}
              onChange={(e) => setDateTo && setDateTo(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-[#b8862f]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;