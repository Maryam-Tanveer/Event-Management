// ─── mockEvents.js ────────────────────────────────────────────────────────────
//
// ✅ Cleaned up — sirf woh data raha jo genuinely static/config hai:
//   - mockEvents    : EventPage aur TicketPage ke liye fallback (jab DB empty ho)
//   - priceOptions  : Price filter ke UX labels — ye data nahi, UI config hai
//   - organizeDefaults / stepperSteps / prestigeCriteria : Form defaults
//
// ❌ Removed (ab dynamic hain):
//   - userData       → MyEventsPage: user?.name se aata hai
//   - tickets        → MyEventsPage: /api/tickets/mine se aata hai
//   - scheduleItems  → MyEventsPage: real tickets se derive hota hai
//   - networkingData → MyEventsPage: real tickets se derive hota hai
//   - documents      → MyEventsPage: real tickets se derive hota hai
//   - categoryOptions → Sidebar: /api/events/categories se aata hai
// ─────────────────────────────────────────────────────────────────────────────

// ── Fallback events — sirf tab use honge jab DB mein koi event nahi ──────────
export const mockEvents = [
  {
    id: 1,
    title: "Symphony Under the Stars",
    category: "Conferences & Seminars",
    badge: "MUSIC",
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    date: "Oct 12",
    time: "7:00 PM",
    location: "Botanical Gardens, NY",
    priceLabel: "From $85",
    price: 85,
    description:
      "An enchanting evening of live orchestral music beneath the open sky, set among the botanical gardens' seasonal blooms.",
    // No agendaSlots / guests — mock events don't have them
    agendaSlots:  [],
    guests:       [],
    amenities:    [],
    avgRating:    0,
    reviewCount:  0,
  },
  {
    id: 2,
    title: "Modern Perspectives Gallery Opening",
    category: "Art & Exhibitions",
    badge: "ART",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=800&auto=format&fit=crop",
    date: "Nov 05",
    time: "6:30 PM",
    location: "The MET, NY",
    priceLabel: "Free (RSVP)",
    price: 0,
    description:
      "A private preview of contemporary works from emerging international artists, followed by an intimate reception.",
    agendaSlots: [], guests: [], amenities: [], avgRating: 0, reviewCount: 0,
  },
  {
    id: 3,
    title: "Haute Cuisine Masterclass",
    category: "Gala & Dinners",
    badge: "CULINARY",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
    date: "Dec 01",
    time: "10:00 AM",
    location: "Culinary Institute, NY",
    priceLabel: "$250",
    price: 250,
    description:
      "Learn signature techniques directly from Michelin-starred chefs in this hands-on masterclass.",
    agendaSlots: [], guests: [], amenities: [], avgRating: 0, reviewCount: 0,
  },
  {
    id: 4,
    title: "Global Leadership Summit 2027",
    category: "Conferences & Seminars",
    badge: "CONFERENCE",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    date: "Jan 15-17",
    time: "9:00 AM",
    location: "Javits Center, NY",
    priceLabel: "From $899",
    price: 899,
    description:
      "A three-day summit bringing together global business leaders, policymakers, and innovators.",
    agendaSlots: [], guests: [], amenities: [], avgRating: 0, reviewCount: 0,
  },
];

// ── Price filter options — ye UX config hai, data nahi ───────────────────────
// Isko dynamic banana zaruri nahi — price ranges fixed hain
export const priceOptions = [
  { key: "any",     label: "Any Price" },
  { key: "free",    label: "Free" },
  { key: "under50", label: "Under $50" },
  { key: "50to150", label: "$50 - $150" },
  { key: "150plus", label: "$150+" },
];

// ── Organize page — form defaults (pure UI, no data) ─────────────────────────
export const organizeDefaults = {
  title: "", synopsis: "", category: "", price: "",
  tags: [], startDate: "", startTime: "", endDate: "", endTime: "",
  timezone: "", format: "In-Person", venue: "", address: "",
  streamUrl: "", previewImage: "", qualityScore: 0,
  selectedTier: "", tierDetails: "", galleryImages: [],
  agendaSlots: [], guests: [], amenities: [], maxTickets: "",
};

export const stepperSteps = [
  { number: 1, label: "Basics",    sub: "Title, Date & Locale" },
  { number: 2, label: "Ticketing", sub: "Tiers, Inventory & VIP" },
  { number: 3, label: "Agenda",    sub: "Multi-Track Timelines" },
  { number: 4, label: "Media",     sub: "Visuals & Brand Assets" },
  { number: 5, label: "Publish",   sub: "Privacy & Launch" },
];

export const prestigeCriteria = [
  "Minimum 3 high-resolution archival banners required.",
  "Verified sommelier and performer profiles attached.",
  "Direct RSVP whitelist management enabled.",
];