import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.jpeg";
import { User, ChevronDown, LogOut, Calendar, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthGate } from "../context/AuthGateContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openLoginModal } = useAuthGate();

  let navLinks = [];
  if (user?.role === "organizer") {
    navLinks = [
      { label: "Discovery", path: "/" },
      { label: "My Events", path: "/my-events" },
      { label: "Curate Event", path: "/organize" },
    ];
  } else if (user?.role === "attendee") {
    navLinks = [
      { label: "Discovery", path: "/" },
      { label: "My Tickets", path: "/my-events" },
    ];
  } else {
    navLinks = [
      { label: "Discovery", path: "/" },
      { label: "Join as Organizer", path: "/create-account" },
    ];
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginHighlight, setLoginHighlight] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = () => {
      setLoginHighlight(true);
      setTimeout(() => setLoginHighlight(false), 2000);
    };
    window.addEventListener("login-prompt-open", handler);
    return () => window.removeEventListener("login-prompt-open", handler);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/signin");
  };

  const handleLoginIconClick = () => {
    openLoginModal();
    setLoginHighlight(true);
    setTimeout(() => setLoginHighlight(false), 2000);
  };

  return (
    <nav className="w-full bg-[#fdf1ea] border-b border-[#e5ddd5] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img className="w-12 h-12 rounded-md object-cover" src={logo} alt="logo" />
          <span className="text-2xl font-bold text-[#3d2a2a]">LuxeEvents</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`font-serif text-[15px] pb-1 transition-colors ${
                  isActive
                    ? "text-[#b8862f] border-b-2 border-[#b8862f]"
                    : "text-[#3d2a2a] hover:text-[#b8862f]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section: User / Auth + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#4a1f2b] text-white hover:bg-[#3a1620] transition-colors"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#8C6B45] text-[13px] font-semibold uppercase">
                  {user.name?.charAt(0) || "U"}
                </span>
                <span className="text-[13px] font-medium max-w-[100px] truncate">{user.name}</span>
                <ChevronDown size={14} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-[#e5ddd5] py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#e5ddd5]">
                    <p className="text-[13px] font-semibold text-[#3d2a2a] truncate">{user.name}</p>
                    <p className="text-[11px] text-[#7a6a6a] truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase tracking-wider bg-[#f5eee3] text-[#8C6B45] px-2 py-0.5 rounded-full font-semibold">
                      {user.role}
                    </span>
                  </div>
                  <Link
                    to="/my-events"
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#3d2a2a] hover:bg-[#F5E6D8]"
                  >
                    <Calendar size={15} /> {user?.role === "organizer" ? "My Events" : "My Tickets"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-red-600 hover:bg-[#F5E6D8]"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginIconClick}
              className={`w-10 h-10 flex items-center justify-center rounded-full bg-[#4a1f2b] text-white hover:bg-[#3a1620] transition-all duration-300 ${
                loginHighlight ? "ring-4 ring-[#b8862f] ring-offset-2 scale-110 animate-pulse" : ""
              }`}
            >
              <User size={20} />
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f0e6dc] transition-colors text-[#3d2a2a]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fdf1ea] border-t border-[#e5ddd5] px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-serif text-[15px] py-2.5 border-b border-[#f0e6dc] transition-colors ${
                  isActive ? "text-[#b8862f]" : "text-[#3d2a2a] hover:text-[#b8862f]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {!user && (
            <div className="flex flex-col gap-2 mt-3">
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-[#3d2a2a] border border-[#d5ccc3] rounded-full hover:bg-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/create-account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#3d1823] rounded-full hover:bg-[#2c1119] transition-colors"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
export default Navbar;