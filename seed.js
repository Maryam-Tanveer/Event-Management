const mongoose = require("mongoose");
const Event = require("./backend/models/Event");

const mockEvents = [
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
  },
];

require("dotenv").config({ path: "./backend/.env" }); // Assuming connection string is in .env or hardcoded?
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/luxeevents"; // Wait, I don't know the exact db name.

// Let's read backend/server.js to find the db connection string.
// I'll just write the file and then run a node script that uses the existing connection logic if possible, or I can just check server.js first.
