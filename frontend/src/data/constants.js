// Application UI constants, taxonomy, and step schemas
// All event data, tickets, and user accounts are loaded dynamically from the MongoDB backend.

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

export const priceOptions = [
  { key: "any", label: "Any Price" },
  { key: "free", label: "Free" },
  { key: "under50", label: "Under $50" },
  { key: "50to150", label: "$50 - $150" },
  { key: "150plus", label: "$150+" },
];

export const organizeDefaults = {
  title: "",
  synopsis: "",
  category: "Galas",
  price: 0,
  tags: [],
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  timezone: "",
  format: "In-Person",
  venue: "",
  address: "",
  city: "",
  coordinates: null,
  streamUrl: "",
  previewImage: "",
  qualityScore: 0,
  selectedTier: "",
  tierDetails: "",
  galleryImages: [],
};

export const stepperSteps = [
  { number: 1, label: "Basics", sub: "Title, Date & Locale" },
  { number: 2, label: "Ticketing", sub: "Tiers, Inventory & VIP" },
  { number: 3, label: "Agenda", sub: "Multi-Track Timelines" },
  { number: 4, label: "Media", sub: "Visuals & Brand Assets" },
  { number: 5, label: "Publish", sub: "Privacy & Launch" },
];

export const prestigeCriteria = [
  "Minimum 3 high-resolution archival banners required.",
  "Verified sommelier and performer profiles attached.",
  "Direct RSVP whitelist management enabled.",
];
