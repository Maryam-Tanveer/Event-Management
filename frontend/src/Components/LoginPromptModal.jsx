import { useNavigate } from "react-router-dom";
import { X, LogIn, UserPlus, Lock } from "lucide-react";

function LoginPromptModal({ onClose }) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onClose();
    navigate("/signin");
  };

  const handleCreateAccount = () => {
    onClose();
    navigate("/create-account");
  };

  // Background click se band
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative animate-fadeInUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a09080] hover:text-[#3d2a2a] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-[#f5eee3] flex items-center justify-center">
            <Lock size={28} className="text-[#8b2d3a]" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-serif font-bold text-[#3d2a2a] text-center mb-2">
          Members Only
        </h2>
        <p className="text-sm text-[#7a6a6a] text-center mb-7 leading-relaxed">
          Please sign in or create an account to access this feature on LuxeEvents.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSignIn}
            className="w-full bg-[#3d1823] hover:bg-[#2c1119] text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            onClick={handleCreateAccount}
            className="w-full border border-[#e0d6cc] bg-[#faf7f4] hover:bg-[#f0e6dc] text-[#3d2a2a] py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        <p className="text-[11px] text-[#a09080] text-center mt-5">
          Exclusive access to curated galas & private events.
        </p>
      </div>
    </div>
  );
}

export default LoginPromptModal;
