// ─── constants.js ─────────────────────────────────────────────────────────────
//
// ✅ Single source of truth for all UI configuration & static labels.
//    All event data, tickets, and user accounts are loaded dynamically
//    from the MongoDB backend — nothing hardcoded here.
//
// ─────────────────────────────────────────────────────────────────────────────

// ── Category options — used by Sidebar (fallback when API fails) ────────────
export const categoryOptions = [
  "All Events",
  "Conferences",
  "Galas",
  "Concerts",
  "Art & Exhibitions",
  "Workshops",
  "Weddings",
  "Networking",
];

// ── Price filter options — UI labels for sidebar price filter ────────────────
export const priceOptions = [
  { key: "any",     label: "Any Price" },
  { key: "free",    label: "Free" },
  { key: "under50", label: "Under $50" },
  { key: "50to150", label: "$50 - $150" },
  { key: "150plus", label: "$150+" },
];

// ── Organize page — empty form defaults (pure UI config) ────────────────────
export const organizeDefaults = {
  title: "",
  synopsis: "",
  category: "",
  price: "",
  tags: [],
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  timezone: "",
  format: "In-Person",
  venue: "",
  address: "",
  latitude: null,
  longitude: null,
  streamUrl: "",
  previewImage: "",
  qualityScore: 0,
  selectedTier: "",
  tierDetails: "",
  galleryImages: [],
  agendaSlots: [],
  guests: [],
  amenities: [],
  maxTickets: "",
};

// ── Stepper steps — organize form wizard UI ─────────────────────────────────
export const stepperSteps = [
  { number: 1, label: "Basics",    sub: "Title, Date & Locale" },
  { number: 2, label: "Ticketing", sub: "Tiers, Inventory & VIP" },
  { number: 3, label: "Agenda",    sub: "Multi-Track Timelines" },
  { number: 4, label: "Media",     sub: "Visuals & Brand Assets" },
  { number: 5, label: "Publish",   sub: "Privacy & Launch" },
];

// ── Prestige criteria — concierge checklist UI ──────────────────────────────
export const prestigeCriteria = [
  "Minimum 3 high-resolution archival banners required.",
  "Verified sommelier and performer profiles attached.",
  "Direct RSVP whitelist management enabled.",
];
