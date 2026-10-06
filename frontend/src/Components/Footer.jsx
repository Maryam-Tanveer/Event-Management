import React, { useState } from "react";
import { Lock, X, Mail, Phone, MapPin, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const MODAL_CONTENT = {
  about: {
    title: "About LuxeEvents",
    subtitle: "The Premier Global Curators of Haute Experiences",
    content: (
      <div className="space-y-4 text-sm text-[#4a3b32] leading-relaxed">
        <p>
          Founded on the principle that moments should transcend the ordinary, <strong>LuxeEvents</strong> is an invitation-only and public showcase for the world's most distinguished gatherings.
        </p>
        <p>
          From black-tie galas overlooking Venetian canals to closed-door sovereign forums and private symphonies under Manhattan skies, every experience hosted on our portal undergoes rigorous prestige evaluation.
        </p>
        <div className="bg-[#f7efe7] p-4 rounded-xl border border-[#e8ded5]">
          <h5 className="font-serif font-bold text-[#3d1823] mb-1">Our Pillars</h5>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>Curatorial Excellence:</strong> Verified prestige venues and world-class hosts.</li>
            <li><strong>Flawless Logistics:</strong> Direct concierge contact and real-time mapping.</li>
            <li><strong>Digital Authenticity:</strong> Zero mock entries, verified ticket tiers, and secure Stripe checkouts.</li>
          </ul>
        </div>
      </div>
    ),
  },
  careers: {
    title: "Careers at LuxeEvents",
    subtitle: "Shape the Future of Elite Hospitality & Event Technology",
    content: (
      <div className="space-y-4 text-sm text-[#4a3b32] leading-relaxed">
        <p>
          We are constantly seeking visionary curators, software engineers, and concierge leads who share our relentless passion for elegance and flawless execution.
        </p>
        <div className="space-y-2">
          <div className="p-3 bg-white rounded-lg border border-[#e5ddd5] flex justify-between items-center">
            <div>
              <p className="font-semibold text-[#3d1823]">Senior Concierge Director</p>
              <p className="text-xs text-stone-500">London & New York • Full-Time</p>
            </div>
            <a href="mailto:careers@luxeevents.com" className="text-xs bg-[#3d1823] text-white px-3 py-1.5 rounded-full hover:bg-[#2c1119]">Apply</a>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#e5ddd5] flex justify-between items-center">
            <div>
              <p className="font-semibold text-[#3d1823]">Luxury Experience Architect</p>
              <p className="text-xs text-stone-500">Paris & Milan • Full-Time</p>
            </div>
            <a href="mailto:careers@luxeevents.com" className="text-xs bg-[#3d1823] text-white px-3 py-1.5 rounded-full hover:bg-[#2c1119]">Apply</a>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#e5ddd5] flex justify-between items-center">
            <div>
              <p className="font-semibold text-[#3d1823]">Full-Stack Platform Engineer</p>
              <p className="text-xs text-stone-500">Remote / Hybrid • Full-Time</p>
            </div>
            <a href="mailto:careers@luxeevents.com" className="text-xs bg-[#3d1823] text-white px-3 py-1.5 rounded-full hover:bg-[#2c1119]">Apply</a>
          </div>
        </div>
      </div>
    ),
  },
  press: {
    title: "Press & Media Inquiries",
    subtitle: "Official Statements, Brand Kits & Media Accreditations",
    content: (
      <div className="space-y-4 text-sm text-[#4a3b32] leading-relaxed">
        <p>
          For journalist credentials, event photography permits, and editorial features regarding our seasonal galas and summits, please connect with our media office.
        </p>
        <div className="bg-[#f7efe7] p-4 rounded-xl border border-[#e8ded5] space-y-2 text-xs">
          <p><strong>Press Office:</strong> press@luxeevents.com</p>
          <p><strong>Media Hotline:</strong> +92 300 1234567</p>
          <p><strong>Press Kit:</strong> High-resolution brand assets, typography specifications, and photography guidelines available upon request.</p>
        </div>
      </div>
    ),
  },
  faqs: {
    title: "Frequently Asked Questions",
    subtitle: "Common Inquiries Regarding Tickets, Access & Concierge",
    content: (
      <div className="space-y-3 text-xs text-[#4a3b32]">
        <details className="bg-white p-3 rounded-lg border border-[#e5ddd5] cursor-pointer">
          <summary className="font-bold text-[#3d1823]">How do I claim my ticket after purchase?</summary>
          <p className="mt-2 text-stone-600">Your tickets and entry barcodes are instantly generated in your account dashboard under "My Tickets" and sent to your registered email.</p>
        </details>
        <details className="bg-white p-3 rounded-lg border border-[#e5ddd5] cursor-pointer">
          <summary className="font-bold text-[#3d1823]">Can I register for free events without payment details?</summary>
          <p className="mt-2 text-stone-600">Yes! Free events and RSVP galas require zero payment information. Simply select your quantity and confirm your instant registration.</p>
        </details>
        <details className="bg-white p-3 rounded-lg border border-[#e5ddd5] cursor-pointer">
          <summary className="font-bold text-[#3d1823]">Are tickets transferable to another guest?</summary>
          <p className="mt-2 text-stone-600">Yes, ticket passes can be reassigned up to 24 hours prior to event commencement by contacting our concierge desk.</p>
        </details>
        <details className="bg-white p-3 rounded-lg border border-[#e5ddd5] cursor-pointer">
          <summary className="font-bold text-[#3d1823]">How do I view event venue maps and navigation?</summary>
          <p className="mt-2 text-stone-600">Every event page features interactive OpenStreetMap coordinates and a direct Google Maps directions button for seamless arrival.</p>
        </details>
      </div>
    ),
  },
  refund: {
    title: "Refund & Cancellation Policy",
    subtitle: "Transparent, Fair, and Protected Reservations",
    content: (
      <div className="space-y-3 text-sm text-[#4a3b32] leading-relaxed">
        <p>
          We recognize that plans in the high-profile world evolve. Our refund policy ensures your investment is treated with respect and protection:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs bg-[#f7efe7] p-4 rounded-xl border border-[#e8ded5]">
          <li><strong>Full Refund (100%):</strong> Cancellations made at least 7 days before event start date receive full reimbursement.</li>
          <li><strong>Concierge Credit (80%):</strong> Cancellations within 3 to 7 days receive luxury booking credit for future LuxeEvents experiences.</li>
          <li><strong>Free Events:</strong> You may cancel or release your free reservation at any moment to open seats for other patrons.</li>
        </ul>
        <p className="text-xs text-stone-500">Refunds are processed through Stripe directly to your original payment method within 5-10 business days.</p>
      </div>
    ),
  },
  privacy: {
    title: "Privacy & Data Protection",
    subtitle: "Discretion and Confidentiality for Elite Patrons",
    content: (
      <div className="space-y-3 text-xs text-[#4a3b32] leading-relaxed">
        <p>
          LuxeEvents strictly complies with global data privacy mandates including GDPR and CCPA. We hold patron discretion as our paramount standard.
        </p>
        <p>
          We do not sell, rent, or distribute attendee lists, financial credentials, or private calendar data to external marketing vendors.
        </p>
        <p>
          All payment card data is processed directly via Stripe PCI-DSS Level 1 certified gateways.
        </p>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Standard Member & Patron Protocol",
    content: (
      <div className="space-y-3 text-xs text-[#4a3b32] leading-relaxed">
        <p>
          By reserving tickets or curating experiences through LuxeEvents, patrons and organizers agree to uphold professional code of conduct, dress code specifications indicated by hosts, and verified credential protocols.
        </p>
        <p>
          Organizers warrant that all venue coordinates, photography rights, and event descriptions accurately reflect genuine physical or virtual gatherings.
        </p>
      </div>
    ),
  },
};

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

    try {
      setIsSubscribing(true);
      const res = await axios.post("/api/newsletter/subscribe", { email: email.trim() });
      toast.success(res.data.message || "Thank you for subscribing to LuxeEvents early access!");
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
                  onClick={() => handleCategoryClick(cat)}
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
              <p className="text-[#b8862f] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
                Explore
              </p>
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
                  <a
                    href="tel:+923001234567"
                    className="hover:text-[#b8862f] transition-colors flex items-center gap-2"
                  >
                    <Phone size={14} className="text-[#b8862f]" />
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
            <button
              onClick={() => setActiveModal("privacy")}
              className="hover:text-[#3d2a2a] transition-colors"
            >
              Privacy Policy
            </button>
            <span className="opacity-40">·</span>
            <button
              onClick={() => setActiveModal("terms")}
              className="hover:text-[#3d2a2a] transition-colors"
            >
              Terms of Service
            </button>
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
