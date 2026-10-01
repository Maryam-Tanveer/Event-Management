import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthGate } from "../context/AuthGateContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { openLoginModal } = useAuthGate();

  useEffect(() => {
    if (!loading && !user) {
      openLoginModal();
    }
  }, [loading, user, openLoginModal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF3EC] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[#8b2d3a] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#6b4c3b] text-sm tracking-wide">Verifying access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FBF3EC] flex flex-col items-center justify-center gap-4">
        <p className="text-[#6b4c3b] text-sm">Please sign in to continue.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
