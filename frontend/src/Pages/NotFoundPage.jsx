import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBF3EC] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <h1
            className="text-[10rem] font-serif font-black leading-none select-none"
            style={{
              background: "linear-gradient(135deg, #8b2d3a 0%, #d4a853 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            aria-label="404 - Page not found"
          >
            404
          </h1>
          {/* Decorative dots */}
          <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-[#d4a853]/20 animate-pulse" />
          <div className="absolute -bottom-2 -left-6 w-8 h-8 rounded-full bg-[#8b2d3a]/15 animate-pulse delay-300" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-serif font-bold text-[#2d1a0e] mb-3">
          Page Not Found
        </h2>
        <p className="text-[#6b4c3b] text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-[#8b2d3a] text-[#8b2d3a] rounded-full text-sm font-semibold hover:bg-[#8b2d3a]/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            aria-label="Go to home page"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#8b2d3a] text-white rounded-full text-sm font-semibold hover:bg-[#6d2330] transition-colors"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Home Page
          </button>
          <button
            onClick={() => navigate("/events")}
            aria-label="Browse all events"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#d4a853] text-[#2d1a0e] rounded-full text-sm font-semibold hover:bg-[#c19a40] transition-colors"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Browse Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
