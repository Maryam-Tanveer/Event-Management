import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Star, Calendar, MapPin, Users, Shield, Sparkles, Music, Palette, Utensils, Briefcase } from "lucide-react";
import logo from "../assets/logo.jpeg";

const categories = [
  { icon: Music, label: "Music & Concerts" },
  { icon: Palette, label: "Art & Exhibitions" },
  { icon: Utensils, label: "Galas & Dinners" },
  { icon: Briefcase, label: "Conferences" },
];

const stats = [
  { value: "500+", label: "Exclusive Events" },
  { value: "12K+", label: "Happy Guests" },
  { value: "200+", label: "Elite Organizers" },
  { value: "4.9★", label: "Average Rating" },
];

function LandingPage() {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get("/api/events?limit=3");
        if (data.events && data.events.length > 0) {
          const mapped = data.events.map((e) => ({
            id: e._id,
            title: e.title,
            category: e.category,
            date: e.startDate,
            location: e.city ? `${e.venue}, ${e.city}` : e.venue,
            price: e.price === 0 ? "Free (RSVP)" : `From $${e.price}`,
            image:
              e.previewImage ||
              "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop",
            badge: e.tags?.[0]?.toUpperCase() || "FEATURED",
          }));
          setFeaturedEvents(mapped);
        }
      } catch (err) {
        console.error("Could not fetch featured events from backend", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF3EC] font-sans">

      {/* ── NAVBAR ── */}
      <nav className="w-full bg-[#fdf1ea] border-b border-[#e5ddd5] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img className="w-10 h-10 rounded-md object-cover" src={logo} alt="logo" />
            <span className="text-xl font-bold text-[#3d2a2a]">LuxeEvents</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/signin")}
              className="px-5 py-2 text-sm font-semibold text-[#3d2a2a] border border-[#d5ccc3] rounded-full hover:bg-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/create-account")}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#3d1823] rounded-full hover:bg-[#2c1119] transition-colors"
            >
              Join Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600')" }}
        />
        <div className="absolute inset-0 bg-[#2d1a0e]/65" />

        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-40 text-center text-white">
          <span className="inline-block text-[11px] tracking-[0.25em] font-bold text-[#d4a853] uppercase mb-4 border border-[#d4a853]/40 px-4 py-1.5 rounded-full">
            ✦ Private Members Portal
          </span>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight font-bold mb-6">
            Where Extraordinary<br />
            <span className="text-[#d4a853]">Moments Begin</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            LuxeEvents is your gateway to the world's most exclusive galas, art openings,
            curated dinners, and private conferences — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/create-account")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#d4a853] hover:bg-[#b8862f] text-[#2d1a0e] font-bold rounded-full text-sm tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              Create Your Account <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold rounded-full text-sm tracking-wide transition-all backdrop-blur-sm"
            >
              Sign In to Explore
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#3d1823] py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-serif font-bold text-[#d4a853]">{s.value}</p>
              <p className="text-white/70 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT IS LUXEEVENTS ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <span className="text-xs tracking-[0.2em] font-semibold text-[#b8862f] uppercase">About the Platform</span>
        <h2 className="font-serif text-4xl md:text-5xl text-[#2d1a0e] font-bold mt-3 mb-6">
          The Premier Event Platform<br />for Discerning Guests
        </h2>
        <p className="text-[#6b4c3b] text-lg max-w-3xl mx-auto leading-relaxed mb-14">
          Whether you're an attendee seeking exclusive cultural experiences, or an organizer
          curating the season's most talked-about events — LuxeEvents is built for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🎫",
              title: "Attendees",
              desc: "Browse and book tickets to exclusive galas, art shows, culinary experiences, and private summits. Your next unforgettable memory is one click away.",
              cta: "Join as Attendee",
            },
            {
              icon: "🏛️",
              title: "Organizers",
              desc: "Create and publish your curated events with full control over ticketing, guest lists, venue details, and media. Build your legacy.",
              cta: "Join as Organizer",
            },
            {
              icon: "⭐",
              title: "Members Only",
              desc: "All events on LuxeEvents are curated for quality. Members enjoy early access, VIP pricing, and exclusive invitations.",
              cta: "Learn More",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-[#ede5dc] hover:shadow-md transition-shadow text-left"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="font-serif text-xl font-bold text-[#3d2a2a] mb-3">{card.title}</h3>
              <p className="text-[#7a6a6a] text-sm leading-relaxed mb-5">{card.desc}</p>
              <button
                onClick={() => {
                  if (card.title === "Organizers") {
                    navigate("/create-account", { state: { role: "organizer" } });
                  } else if (card.title === "Attendees") {
                    navigate("/create-account", { state: { role: "attendee" } });
                  } else {
                    navigate("/signin");
                  }
                }}
                className="text-sm font-semibold text-[#b8862f] hover:text-[#8b5e1a] flex items-center gap-1 transition-colors"
              >
                {card.cta} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── EVENT CATEGORIES ── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.2em] font-semibold text-[#b8862f] uppercase">Explore</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2d1a0e] font-bold mt-2">
              Event Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => navigate("/create-account")}
                className="flex flex-col items-center gap-3 p-6 bg-[#FBF3EC] rounded-2xl border border-[#ede5dc] hover:border-[#b8862f] hover:bg-[#f5eee3] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#3d1823] flex items-center justify-center group-hover:bg-[#b8862f] transition-colors">
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-[#3d2a2a]">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs tracking-[0.2em] font-semibold text-[#b8862f] uppercase">Upcoming</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2d1a0e] font-bold mt-2">
              Featured Events
            </h2>
          </div>
          <button
            onClick={() => navigate("/create-account")}
            className="text-sm font-semibold text-[#b8862f] hover:text-[#8b5e1a] flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#ede5dc] shadow-sm hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => navigate("/tickets", { state: { eventId: event.id } })}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#3d1823] text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full">
                  {event.badge}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-[#3d2a2a] mb-2 leading-tight">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[#7a6a6a] text-xs mb-1">
                  <Calendar size={12} /> {event.date}
                </div>
                <div className="flex items-center gap-1.5 text-[#7a6a6a] text-xs mb-4">
                  <MapPin size={12} /> {event.location}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#3d2a2a]">{event.price}</span>
                  <span className="text-xs text-[#b8862f] font-semibold">Sign in to book →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY LUXEEVENTS ── */}
      <section className="bg-[#3d1823] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs tracking-[0.2em] font-semibold text-[#d4a853] uppercase">Why Choose Us</span>
          <h2 className="font-serif text-4xl text-white font-bold mt-3 mb-14">
            The LuxeEvents Difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Events", desc: "Every event is verified by our curatorial team for quality and authenticity." },
              { icon: Star, title: "VIP Experience", desc: "Priority seating, exclusive lounges, and complimentary welcome receptions." },
              { icon: Users, title: "Elite Network", desc: "Connect with cultural patrons, artists, leaders, and innovators worldwide." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#d4a853]/20 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-[#d4a853]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Sparkles size={32} className="text-[#b8862f] mx-auto mb-4" />
        <h2 className="font-serif text-4xl md:text-5xl text-[#2d1a0e] font-bold mb-5">
          Ready to Join the Inner Circle?
        </h2>
        <p className="text-[#6b4c3b] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Create your free account today and get instant access to exclusive events, VIP tickets, and unforgettable experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/create-account")}
            className="flex items-center justify-center gap-2 px-10 py-4 bg-[#3d1823] hover:bg-[#2c1119] text-white font-bold rounded-full text-sm tracking-wide transition-all shadow-lg"
          >
            Create Free Account <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="flex items-center justify-center gap-2 px-10 py-4 border border-[#d5ccc3] text-[#3d2a2a] font-semibold rounded-full text-sm tracking-wide hover:bg-white transition-all"
          >
            Already a Member? Sign In
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#FBF0E4] border-t border-[#e5ddd5] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img className="w-8 h-8 rounded-md object-cover" src={logo} alt="logo" />
            <span className="font-bold text-[#3d2a2a]">LuxeEvents</span>
          </div>
          <p className="text-xs text-[#a09080]">© {new Date().getFullYear()} LuxeEvents. All rights reserved. Crafted with precision.</p>
          <div className="flex gap-6 text-xs text-[#7a6a6a]">
            <a href="/" className="hover:text-[#3d2a2a]">Privacy</a>
            <a href="/" className="hover:text-[#3d2a2a]">Terms</a>
            <a href="/" className="hover:text-[#3d2a2a]">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
