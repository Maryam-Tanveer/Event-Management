import React from "react";
import { categoryOptions, priceOptions } from "../../data/mockEvents";

function Sidebar({ category, setCategory, priceKey, setPriceKey }) {
  return (
    <aside className="w-full lg:w-56 flex-shrink-0">
      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-stone-900 mb-3">
          Categories
        </h4>
        <div className="flex flex-col gap-2">
          {categoryOptions.map((cat) => (
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
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-stone-900 mb-3">
          Price Range
        </h4>
        <div className="flex flex-col gap-2">
          {priceOptions.map((p) => (
            <label
              key={p.key}
              className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer"
            >
              <input
                type="radio"
                name="price"
                checked={priceKey === p.key}
                onChange={() => setPriceKey(p.key)}
                className="border-stone-300 text-orange-700 focus:ring-orange-600"
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;