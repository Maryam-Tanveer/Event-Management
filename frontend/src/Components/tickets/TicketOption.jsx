import React from "react";

function TicketOption ({ id, label, price, description, popular, selected, onSelect })  {
  return (
    <label
      className={`block rounded-xl p-4 cursor-pointer relative transition-colors ${
        selected
          ? "border-2 border-[#b8862f] bg-[#fbf8f5]"
          : "border border-gray-200 hover:border-[#b8862f]"
      }`}
    >
      {popular && (
        <div className="absolute -top-2.5 right-4 bg-[#b8862f] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          Popular
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2">
          <input
            type="radio"
            name="ticket"
            className="mt-1 accent-[#4a1f2b]"
            checked={selected}
            onChange={() => onSelect(id)}
          />
          <span className="font-medium text-[#3d2a2a]">{label}</span>
        </div>
        <span className="font-medium text-[#3d2a2a]">{price}</span>
      </div>
      <p className="text-xs text-gray-500 pl-6">{description}</p>
    </label>
  );
};

export default TicketOption;