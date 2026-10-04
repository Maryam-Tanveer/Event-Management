import { Trash2, X } from "lucide-react";

function ConfirmDeleteModal({ eventTitle, onConfirm, onCancel }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#a09080] hover:text-[#3d2a2a] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 size={28} className="text-red-500" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-serif font-bold text-[#3d2a2a] text-center mb-2">
          Delete Event?
        </h2>
        <p className="text-sm text-[#7a6a6a] text-center mb-2 leading-relaxed">
          Are you sure you want to delete
        </p>
        <p className="text-sm font-semibold text-[#3d2a2a] text-center mb-6 leading-relaxed px-2">
          "{eventTitle}"
        </p>
        <p className="text-xs text-red-400 text-center mb-7">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-[#e0d6cc] bg-[#faf7f4] hover:bg-[#f0e6dc] text-[#3d2a2a] rounded-lg text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
