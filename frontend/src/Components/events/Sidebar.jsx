import React from "react";
import { categoryOptions, priceOptions } from "../../data/mockEvents";
import { Calendar } from "lucide-react";

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
      setDateFrom(todayStr);
      setDateTo(todayStr);
    } else if (type === "weekend") {
      const day = today.getDay();
      // Distance to Saturday (day 6)
      const diffToSat = (6 - day + 7) % 7;
      const sat = new Date(today);
      sat.setDate(today.getDate() + diffToSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);

      setDateFrom(formatDate(sat));
      setDateTo(formatDate(sun));
    } else if (type === "month") {
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);
      setDateFrom(formatDate(today));
      setDateTo(formatDate(nextMonth));
    } else if (type === "clear") {
      setDateFrom("");
      setDateTo("");
    }
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
            className="text-xs text-orange-700 hover:text-orange-900 font-semibold underline"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-stone-900 mb-3">
          Categories
        </h4>
        <div className="flex flex-col gap-1.5">
          {categoryOptions.map((cat) => {
            const isSelected = category === cat;
            return (
              <label
                key={cat}
                className={`flex items-center gap-2.5 text-xs cursor-pointer py-1.5 px-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#f5e6d8] text-[#3d1823] font-semibold"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    setCategory(isSelected && cat !== "All Events" ? "All Events" : cat)
                  }
                  className="rounded border-stone-300 text-orange-700 focus:ring-orange-600"
                />
                {cat}
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-stone-900 mb-3">
          Price Range
        </h4>
        <div className="flex flex-col gap-1.5">
          {priceOptions.map((p) => {
            const isSelected = priceKey === p.key;
            return (
              <label
                key={p.key}
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
                  onChange={() => setPriceKey(p.key)}
                  className="border-stone-300 text-orange-700 focus:ring-orange-600"
                />
                {p.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-[#fdfaf7] border border-stone-200 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
            <Calendar size={13} className="text-[#b8862f]" />
            Date Range
          </h4>
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => handleQuickDate("clear")}
              className="text-[11px] text-orange-800 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick presets */}
        <div className="grid grid-cols-3 gap-1 mb-3">
          <button
            type="button"
            onClick={() => handleQuickDate("today")}
            className="text-[10px] font-medium py-1 px-1.5 rounded bg-white border border-stone-200 hover:border-[#b8862f] text-stone-700 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate("weekend")}
            className="text-[10px] font-medium py-1 px-1.5 rounded bg-white border border-stone-200 hover:border-[#b8862f] text-stone-700 transition-colors"
          >
            Weekend
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate("month")}
            className="text-[10px] font-medium py-1 px-1.5 rounded bg-white border border-stone-200 hover:border-[#b8862f] text-stone-700 transition-colors"
          >
            30 Days
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">
              From
            </label>
            <input
              type="date"
              value={dateFrom || ""}
              onChange={(e) => setDateFrom && setDateFrom(e.target.value)}
              className="w-full text-xs px-2 py-1.5 bg-white border border-stone-200 rounded-md text-stone-800 focus:outline-none focus:border-[#b8862f]"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">
              To
            </label>
            <input
              type="date"
              value={dateTo || ""}
              onChange={(e) => setDateTo && setDateTo(e.target.value)}
              className="w-full text-xs px-2 py-1.5 bg-white border border-stone-200 rounded-md text-stone-800 focus:outline-none focus:border-[#b8862f]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;