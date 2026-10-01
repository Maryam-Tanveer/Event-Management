import React from "react";
import { Minus, Plus } from "lucide-react";

function QuantitySelector ({ quantity, onIncrease, onDecrease }) {
  return (
    <div className="bg-[#fbf3ec] p-4 rounded-xl flex justify-between items-center mb-6">
      <span className="text-sm font-medium text-[#3d2a2a]">Quantity</span>
      <div className="flex items-center gap-4 bg-white px-2 py-1 rounded-lg">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600"
          onClick={onDecrease}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="font-medium">{quantity}</span>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600"
          onClick={onIncrease}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;