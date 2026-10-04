import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Footer() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success(`You're on the list! We'll be in touch at ${email}.`);
      setEmail("");
    }
  };

  const categories = ["Galas", "Conferences", "Concerts", "Workshops", "Weddings"];

  return (
    <footer className="w-full mt-auto font-sans">

      {/* ══ TOP — Dark Maroon Section ══ */}
      <div className="bg-[#3d1823] px-6 md:px-16 pt-14 pb-14">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12">

          {/* Left: Brand & Categories */}
          <div>
            <h2 className="text-3xl font-serif text-white mb-3">LuxeEvents</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
              Crafting unforgettable experiences with effortless elegance.
            </p>

            <p className="text-[#d4a853] text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
              BROWSE BY CATEGORY
            </p>
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate("/events", { state: { category: cat } })}
                  className="px-4 py-1.5 text-xs font-medium rounded-full border border-[#d4a853]/50 text-[#d4a853] hover:bg-[#d4a853] hover:text-[#3d1823] transition-all duration-200"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Newsletter Card */}
          <div className="bg-[#f5ebe0] rounded-2xl p-8 w-full lg:w-[400px] flex-shrink-0">
            <h3 className="text-xl font-serif text-[#3d2a2a] mb-2">Get early access</h3>
            <p className="text-sm text-[#6b4c3b] leading-relaxed mb-6">
              Be first to hear about new events and private invitations.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-[#d5ccc3] rounded-sm text-sm text-[#3d2a2a] placeholder:text-[#a09080] focus:outline-none focus:border-[#3d1823] transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-[#3d1823] text-white py-3 rounded-sm text-sm font-bold tracking-[0.2em] uppercase hover:bg-[#2c1119] transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ══ MIDDLE — Light Links Section ══ */}
      <div className="bg-[#FBF3EC] px-6 md:px-16 pt-12 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

            <div>
              <p className="text-[#b8862f] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">Explore</p>
              <ul className="space-y-3 text-sm text-[#3d2a2a]">
                <li><Link to="/" className="hover:text-[#b8862f] transition-colors">Discovery</Link></li>
                <li><Link to="/events" className="hover:text-[#b8862f] transition-colors">Browse Events</Link></li>
                <li><Link to="/my-events" className="hover:text-[#b8862f] transition-colors">My Tickets</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[#b8862f] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">Company</p>
              <ul className="space-y-3 text-sm text-[#3d2a2a]">
                <li><a href="#about" className="hover:text-[#b8862f] transition-colors">About Us</a></li>
                <li><a href="mailto:careers@luxeevents.com" className="hover:text-[#b8862f] transition-colors">Careers</a></li>
                <li><a href="mailto:press@luxeevents.com" className="hover:text-[#b8862f] transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <p className="text-[#b8862f] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">Support</p>
              <ul className="space-y-3 text-sm text-[#3d2a2a]">
                <li><a href="mailto:support@luxeevents.com" className="hover:text-[#b8862f] transition-colors">Contact Us</a></li>
                <li><a href="#faq" className="hover:text-[#b8862f] transition-colors">FAQs</a></li>
                <li><a href="mailto:support@luxeevents.com" className="hover:text-[#b8862f] transition-colors">Refund Policy</a></li>
              </ul>
            </div>

            <div>
              <p className="text-[#b8862f] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">Contact</p>
              <ul className="space-y-3 text-sm text-[#3d2a2a]">
                <li>
                  <a href="mailto:support@luxeevents.com" className="hover:text-[#b8862f] transition-colors">
                    support@luxeevents.com
                  </a>
                </li>
                <li>
                  <a href="tel:+923001234567" className="hover:text-[#b8862f] transition-colors">
                    +92 300 1234567
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ══ BOTTOM BAR ══ */}
      <div className="bg-[#FBF3EC] border-t border-[#e5ddd5] px-6 md:px-16 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#7a6a6a]">

          <p>© {new Date().getFullYear()} LuxeEvents. All rights reserved.</p>

          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>Secure payments</span>
          </div>

          <div className="flex gap-3 items-center">
            <a href="#privacy" className="hover:text-[#3d2a2a] transition-colors">Privacy Policy</a>
            <span className="opacity-40">·</span>
            <a href="#terms" className="hover:text-[#3d2a2a] transition-colors">Terms of Service</a>
          </div>

        </div>
      </div>

    </footer>
  );
}

export default Footer;
