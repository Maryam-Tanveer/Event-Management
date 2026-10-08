import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Contact modal form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("General Inquiry");
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  const navigate = useNavigate();

  // Handle Newsletter Subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      toast.success(`You're on the list! We'll be in touch at ${email}.`);
      setEmail("");
    } catch (err) {
      const msg = err.response?.data?.message || "Subscription failed. Please check your email.";
      toast.error(msg);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle Contact Inquiry Form
  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    try {
      setIsSendingInquiry(true);
      const res = await axios.post("/api/newsletter/contact", {
        name: contactName.trim(),
        email: contactEmail.trim(),
        subject: contactSubject.trim(),
        message: contactMessage.trim(),
      });
      toast.success(res.data.message || "Your inquiry has been submitted to our concierge team.");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setActiveModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSendingInquiry(false);
    }
  };

  const categories = ["Galas", "Conferences", "Concerts", "Workshops", "Weddings"];

  const handleCategoryClick = (cat) => {
    navigate(`/events?category=${encodeURIComponent(cat)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full mt-auto font-sans">
      {/* ══ TOP — Dark Maroon Section ══ */}
      <div className="bg-[#3d1823] px-6 md:px-16 pt-14 pb-14">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12">
          {/* Left: Brand & Categories */}
          <div>
            <h2 className="text-3xl font-serif text-white mb-3">LuxeEvents</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">
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
          <div className="bg-[#f5ebe0] rounded-2xl p-8 w-full lg:w-[400px] flex-shrink-0 shadow-lg">
            <h3 className="text-xl font-serif text-[#3d2a2a] mb-2 font-bold">Get early access</h3>
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
                className="w-full px-4 py-3 bg-white border border-[#d5ccc3] rounded-lg text-sm text-[#3d2a2a] placeholder:text-[#a09080] focus:outline-none focus:border-[#3d1823] transition-colors"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full bg-[#3d1823] text-white py-3 rounded-lg text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#2c1119] transition-colors duration-200 disabled:opacity-50"
              >
                {isSubscribing ? "Subscribing..." : "SUBSCRIBE"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ══ MIDDLE — Light Links Section ══ */}
      <div className="bg-[#FBF3EC] px-6 md:px-16 pt-12 pb-10 border-t border-[#e5ddd5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Explore */}
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
                  <button
                    onClick={() => handleNavClick("/events")}
                    className="hover:text-[#b8862f] transition-colors text-left"
                  >
                    Discovery
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/events")}
                    className="hover:text-[#b8862f] transition-colors text-left"
                  >
                    Browse Events
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/my-events")}
                    className="hover:text-[#b8862f] transition-colors text-left"
                  >
                    My Tickets
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[#b8862f] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
                Company
              </p>
              <ul className="space-y-3 text-sm text-[#3d2a2a]">
                <li>
                  <button
                    onClick={() => setActiveModal("about")}
                    className="hover:text-[#b8862f] transition-colors text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("careers")}
                    className="hover:text-[#b8862f] transition-colors text-left"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("press")}
                    className="hover:text-[#b8862f] transition-colors text-left"
                  >
                    Press
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="text-[#b8862f] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
                Support
              </p>
              <ul className="space-y-3 text-sm text-[#3d2a2a]">
                <li>
                  <button
                    onClick={() => setActiveModal("contact")}
                    className="hover:text-[#b8862f] transition-colors text-left font-medium"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("faqs")}
                    className="hover:text-[#b8862f] transition-colors text-left"
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("refund")}
                    className="hover:text-[#b8862f] transition-colors text-left"
                  >
                    Refund Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <p className="text-[#b8862f] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
                Contact
              </p>
              <ul className="space-y-3 text-sm text-[#3d2a2a]">
                <li>
                  <a
                    href="mailto:support@luxeevents.com"
                    className="hover:text-[#b8862f] transition-colors flex items-center gap-2"
                  >
                    <Mail size={14} className="text-[#b8862f]" />
                    support@luxeevents.com
                  </a>
                </li>
                <li>
                  <a href="tel:+923001234567" className="hover:text-[#b8862f] transition-colors">
                    +92 300 1234567
                  </a>
                </li>
                <li>
                  <span className="text-xs text-stone-500 flex items-center gap-2">
                    <MapPin size={14} className="text-[#b8862f]" />
                    Manhattan • London • Milan
                  </span>
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
            <Lock className="w-3.5 h-3.5 text-[#b8862f]" />
            <span>Secure payments</span>
          </div>

          <div className="flex gap-3 items-center">
            <a href="#privacy" className="hover:text-[#3d2a2a] transition-colors">Privacy Policy</a>
            <span className="opacity-40">·</span>
            <a href="#terms" className="hover:text-[#3d2a2a] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* ══ INTERACTIVE INFO & CONTACT MODAL ══ */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FBF3EC] rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#e5ddd5] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-800 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {activeModal === "contact" ? (
              <div>
                <span className="text-[10px] tracking-[0.25em] font-bold text-[#b8862f] uppercase block mb-1">
                  CONCIERGE DESK
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#3d1823] mb-1">
                  Contact Our Concierge
                </h3>
                <p className="text-xs text-stone-600 mb-6">
                  Have a question regarding luxury ticketing, private reservations, or event hosting?
                </p>

                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[#3d1823]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. eleanor@example.com"
                      className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[#3d1823]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                      Subject
                    </label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[#3d1823]"
                    >
                      <option value="General Inquiry">General Concierge Inquiry</option>
                      <option value="VIP Seating">VIP Seating & Box Reservations</option>
                      <option value="Event Hosting">Hosting an Event on LuxeEvents</option>
                      <option value="Press / Media">Press & Sponsorship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="How may our concierge assist your plans?"
                      className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[#3d1823]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingInquiry}
                    className="w-full bg-[#3d1823] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#2c1119] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={13} />
                    {isSendingInquiry ? "Sending..." : "Submit Inquiry"}
                  </button>
                </form>
              </div>
            ) : MODAL_CONTENT[activeModal] ? (
              <div>
                <span className="text-[10px] tracking-[0.25em] font-bold text-[#b8862f] uppercase block mb-1">
                  LUXEEVENTS DIRECTORY
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#3d1823] mb-1">
                  {MODAL_CONTENT[activeModal].title}
                </h3>
                <p className="text-xs text-stone-500 mb-6">
                  {MODAL_CONTENT[activeModal].subtitle}
                </p>
                {MODAL_CONTENT[activeModal].content}
                <div className="mt-8 pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="bg-[#3d1823] text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-[#2c1119]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
