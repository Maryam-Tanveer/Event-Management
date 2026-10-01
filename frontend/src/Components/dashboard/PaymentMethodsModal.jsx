import React, { useState } from "react";
import { X, CreditCard, Plus } from "lucide-react";
import toast from "react-hot-toast";

function PaymentMethodsModal({ onClose }) {
  const [cards, setCards] = useState([
    { id: 1, type: "Visa", last4: "4242", exp: "12/28", isDefault: true },
    { id: 2, type: "Mastercard", last4: "5555", exp: "08/27", isDefault: false },
  ]);

  const handleAddCard = () => {
    toast.success("Add new card flow will open here.");
  };

  const handleSetDefault = (id) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isDefault: true } : { ...card, isDefault: false }
      )
    );
    toast.success("Default payment method updated");
  };

  const handleDelete = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    toast.success("Card removed successfully");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fdf1ea] rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative border border-[#e5ddd5]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-[#3d2a2a]">Payment Methods</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Saved Cards */}
        <div className="space-y-4 mb-6">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-4 bg-white border border-[#e5ddd5] rounded-xl hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#FBF3EC] rounded-lg text-[#3d1823]">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#3d2a2a]">
                      {card.type} ending in {card.last4}
                    </p>
                    <p className="text-xs text-gray-500">Expires {card.exp}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {card.isDefault ? (
                    <span className="text-[10px] font-bold bg-[#3d1823] text-white px-2 py-1 rounded-full uppercase tracking-wider">
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(card.id)}
                      className="text-xs text-gray-500 hover:text-[#3d1823] underline"
                    >
                      Set Default
                    </button>
                  )}
                  {!card.isDefault && (
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No saved payment methods.
            </p>
          )}
        </div>

        {/* Add New Button */}
        <button
          onClick={handleAddCard}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#d5ccc3] rounded-xl text-[#3d2a2a] hover:bg-white hover:border-[#3d1823] hover:text-[#3d1823] transition-all font-medium text-sm"
        >
          <Plus size={18} />
          Add New Payment Method
        </button>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-[#d5ccc3] text-[#3d2a2a] text-sm font-semibold hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethodsModal;
