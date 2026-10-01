import React from "react";

function OrderSummary({ subtotal, discount, taxes, total }) {
  return (
    <div className="space-y-3 text-sm text-[#3d2a2a] mb-6">
      <div className="flex justify-between">
        <span className="text-gray-500">Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-green-700">
          <span>Discount</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between">
        <span className="text-gray-500">Taxes & Fees</span>
        <span>${taxes.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-100">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;