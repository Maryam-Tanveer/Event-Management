// Mock data — baad me API/backend se replace hoga
// Component isi shape (fields) ki ummeed karega, isliye API response bhi
// isi structure me hona chahiye

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
      "An enchanting evening of live orchestral music beneath the open sky, set among the botanical gardens' seasonal blooms. Expect a program of classical favorites paired with a curated selection of wines.",
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
      "A private preview of contemporary works from emerging international artists, followed by an intimate reception with the curators and featured creators.",
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
      "Learn signature techniques directly from Michelin-starred chefs in this hands-on masterclass, concluding with a tasting of the dishes prepared during the session.",
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
      "A three-day summit bringing together global business leaders, policymakers, and innovators for keynote sessions, panel discussions, and high-value networking.",
  },
];

export const categoryOptions = [
  "All Events",
  "Conferences & Seminars",
  "Gala & Dinners",
  "Weddings",
  "Art & Exhibitions",
];

export const priceOptions = [
  { key: "any", label: "Any Price" },
  { key: "free", label: "Free" },
  { key: "under50", label: "Under $50" },
  { key: "50to150", label: "$50 - $150" },
  { key: "150plus", label: "$150+" },
];

// ─── Dashboard / MyEventsPage mock data ───────────────────────────────────────

export const userData = {
  name: "Sophia Bennett",
  membership: "Gold Member · Joined 2023",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
};

export const tickets = [
  {
    id: 1,
    ticketId: "TK-00421",
    title: "Symphony Under the Stars",
    category: "Music",
    accessType: "VIP Access",
    date: "Oct 12, 2026 · 7:00 PM",
    location: "Botanical Gardens, NY",
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    ticketId: "TK-00438",
    title: "Global Leadership Summit 2027",
    category: "Conference",
    accessType: "General Admission",
    date: "Jan 15–17, 2027 · 9:00 AM",
    location: "Javits Center, NY",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
  },
];

export const scheduleItems = [
  {
    date: "Oct 12",
    time: "7:00 PM",
    title: "Symphony Under the Stars",
    subtitle: "Botanical Gardens, NY",
    tag: "Featured Event",
    active: true,
  },
  {
    date: "Nov 05",
    time: "6:30 PM",
    title: "Modern Perspectives Gallery Opening",
    subtitle: "The MET, NY",
    tag: "",
    active: false,
  },
  {
    date: "Jan 15",
    time: "9:00 AM",
    title: "Global Leadership Summit 2027",
    subtitle: "Javits Center, NY",
    tag: "Multi-Day",
    active: false,
  },
];

export const networkingData = {
  attendeeCount: 248,
  eventName: "Leadership Summit",
  extraCount: 40,
  avatars: [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=80&auto=format&fit=crop",
  ],
};

export const documents = [
  {
    id: 1,
    icon: "🎫",
    title: "Symphony Under the Stars — Ticket",
    subtitle: "PDF · Issued Oct 1, 2026",
  },
  {
    id: 2,
    icon: "📜",
    title: "Leadership Summit — Certificate",
    subtitle: "PDF · Issued Jan 18, 2027",
  },
  {
    id: 3,
    icon: "🗺️",
    title: "Summit Venue Map",
    subtitle: "PDF · Updated Jan 10, 2027",
  },
];

// ─── Organize / Curate Page mock data ──────────────────────────────────────────

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