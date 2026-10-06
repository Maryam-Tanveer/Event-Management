import React from "react";
import { categoryOptions, priceOptions } from "../../data/constants";
import { Calendar, RotateCcw } from "lucide-react";

function Sidebar({
  category,
  setCategory,
  priceKey,
  setPriceKey,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onReset,
}) {
  const hasActiveFilters =
    category !== "All Events" ||
    priceKey !== "any" ||
    Boolean(dateFrom) ||
    Boolean(dateTo);

  // Helper for quick date presets
  const handleQuickDate = (type) => {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split("T")[0];

    if (type === "today") {
      const todayStr = formatDate(today);
      if (setDateFrom) setDateFrom(todayStr);
      if (setDateTo) setDateTo(todayStr);
    } else if (type === "weekend") {
      const day = today.getDay();
      const diffToSat = (6 - day + 7) % 7;
      const sat = new Date(today);
      sat.setDate(today.getDate() + diffToSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);

      if (setDateFrom) setDateFrom(formatDate(sat));
      if (setDateTo) setDateTo(formatDate(sun));
    } else if (type === "month") {
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);
      if (setDateFrom) setDateFrom(formatDate(today));
      if (setDateTo) setDateTo(formatDate(nextMonth));
    } else if (type === "clear") {
      if (setDateFrom) setDateFrom("");
      if (setDateTo) setDateTo("");
    }
  };

  // Category selection handler supporting multi-selection or single-toggle
  const handleCategoryToggle = (cat) => {
    if (cat === "All Events") {
      setCategory("All Events");
      return;
    }

    if (category === "All Events" || !category) {
      setCategory(cat);
      return;
    }

    const currentCats = category.split(",").map((c) => c.trim()).filter(Boolean);
    const exists = currentCats.includes(cat);

    let nextCats;
    if (exists) {
      nextCats = currentCats.filter((c) => c !== cat);
    } else {
      nextCats = [...currentCats, cat];
    }

    if (nextCats.length === 0) {
      setCategory("All Events");
    } else {
      setCategory(nextCats.join(","));
    }
  };

  const isCatSelected = (cat) => {
    if (cat === "All Events") return category === "All Events" || !category;
    const currentCats = (category || "").split(",").map((c) => c.trim());
    return currentCats.includes(cat);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* Active filters header / reset */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Filter Events
        </span>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setCategory("All Events");
              setPriceKey("any");
              if (setDateFrom) setDateFrom("");
              if (setDateTo) setDateTo("");
              if (onReset) onReset();
            }}
            className="flex items-center gap-1 text-xs text-amber-800 hover:text-amber-950 font-semibold underline"
          >
            <RotateCcw size={11} />
            Reset All
          </button>
        )}
      </div>

      {/* 1. Categories Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-stone-900">Categories</h4>
          {category !== "All Events" && (
            <button
              onClick={() => setCategory("All Events")}
              className="text-[11px] text-stone-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {categoryOptions.map((cat) => {
            const selected = isCatSelected(cat);
            return (
              <label
                key={cat}
                className={`flex items-center gap-2.5 text-xs cursor-pointer py-1.5 px-2 rounded-lg transition-colors ${
                  selected
                    ? "bg-[#f5e6d8] text-[#3d1823] font-semibold"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleCategoryToggle(cat)}
                  className="rounded border-stone-300 text-amber-800 focus:ring-amber-700 cursor-pointer"
                />
                <span className="flex-1">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-stone-900">Price Range</h4>
          {priceKey !== "any" && (
            <button
              onClick={() => setPriceKey("any")}
              className="text-[11px] text-stone-500 hover:underline"
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