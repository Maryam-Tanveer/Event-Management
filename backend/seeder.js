require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Event = require("./models/Event");
const Ticket = require("./models/Ticket");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/luxeevents";
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB for seeding:", uri);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log("🗑️ Clearing existing events, tickets, and seed users...");
    await Event.deleteMany({});
    await Ticket.deleteMany({});
    await User.deleteMany({ email: { $in: ["organizer@luxeevents.com", "attendee@luxeevents.com"] } });

    console.log("👤 Creating seed users (organizer & attendee)...");
    const organizer = await User.create({
      name: "Victoria Sterling",
      email: "organizer@luxeevents.com",
      password: "password123",
      role: "organizer",
    });

    const attendee = await User.create({
      name: "Alexander Wright",
      email: "attendee@luxeevents.com",
      password: "password123",
      role: "attendee",
    });

    console.log("🏛️ Seeding curated luxury events...");
    const events = await Event.create([
      {
        title: "Symphony Under the Stars",
        synopsis: "An enchanting nocturnal philharmonic performance beneath an open Manhattan celestial canopy. Featuring award-winning soloists, vintage champagne, and curated musical movements.",
        category: "Concerts",
        price: 85,
        tags: ["MUSIC", "ORCHESTRA", "FEATURED"],
        startDate: "2026-10-12",
        startTime: "19:30",
        endDate: "2026-10-12",
        endTime: "22:30",
        timezone: "America/New_York (EST)",
        format: "In-Person",
        venue: "Central Park Conservatory Pavilion",
        address: "72nd Street & 5th Ave",
        city: "New York",
        coordinates: { lat: 40.7725, lng: -73.9712 },
        previewImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
        ],
        qualityScore: 98,
        selectedTier: "Standard Admission",
        tierDetails: "Full amphitheater admission with complimentary sommelier flute on arrival.",
        agenda: "07:00 PM - Red Carpet & Champagne Reception\n08:00 PM - Philharmonic Overture\n09:30 PM - Intermission & Sommelier Reserve Lounge\n10:00 PM - Grand Finale & Patron Meet-and-Greet",
        privacy: "Public",
        organizer: organizer._id,
      },
      {
        title: "Modern Perspectives Gallery Opening",
        synopsis: "An exclusive preview showcasing contemporary abstract masterpieces, modernist sculptures, and private collections before public museum debut.",
        category: "Workshops",
        price: 0,
        tags: ["ART", "CURATED", "FREE"],
        startDate: "2026-11-05",
        startTime: "18:00",
        endDate: "2026-11-05",
        endTime: "21:30",
        timezone: "America/New_York (EST)",
        format: "In-Person",
        venue: "The Metropolitan Arts Wing",
        address: "1000 5th Avenue",
        city: "New York",
        coordinates: { lat: 40.7794, lng: -73.9632 },
        previewImage: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200&auto=format&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80",
        ],
        qualityScore: 95,
        selectedTier: "General Admission",
        tierDetails: "Complimentary patron access and private catalog gift.",
        agenda: "06:00 PM - Curatorial Introduction & Private Walkthrough\n07:15 PM - Artist Keynote in The North Wing\n08:30 PM - Cocktail Vernissage & Canapés",
        privacy: "Public",
        organizer: organizer._id,
      },
      {
        title: "Global Leadership & Innovation Summit",
        synopsis: "Three days of transformative keynotes, visionary venture roundtables, and executive networking with industry titans, tech innovators, and global policymakers.",
        category: "Conferences",
        price: 899,
        tags: ["CONFERENCE", "KEYNOTE", "INNOVATION"],
        startDate: "2027-01-15",
        startTime: "09:00",
        endDate: "2027-01-17",
        endTime: "18:00",
        timezone: "America/New_York (EST)",
        format: "Hybrid",
        streamUrl: "https://stream.luxeevents.com/live/summit2027",
        venue: "Javits Center Grand Ballroom",
        address: "429 11th Ave",
        city: "New York",
        coordinates: { lat: 40.7580, lng: -74.0021 },
        previewImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80",
        ],
        qualityScore: 100,
        selectedTier: "Executive Delegate",
        tierDetails: "All-access badge, VIP breakfast roundtables, and exclusive digital conference suite.",
        agenda: "09:00 AM - Registration & Welcome Breakfast\n10:00 AM - Opening Keynote: AI & Global Economies\n01:00 PM - Executive Networking Luncheon\n03:00 PM - Venture Capital & Founder Panels\n06:00 PM - Chairman's Evening Reception",
        privacy: "Public",
        organizer: organizer._id,
      },
      {
        title: "Venetian Masquerade Grand Gala",
        synopsis: "Step into Renaissance majesty at the Doge's Palace. Handcrafted masks, Baroque chamber melodies, theatrical performances, and an imperial 7-course feast.",
        category: "Galas",
        price: 350,
        tags: ["GALA", "BLACK-TIE", "VENICE"],
        startDate: "2026-10-24",
        startTime: "19:30",
        endDate: "2026-10-25",
        endTime: "02:00",
        timezone: "Europe/Rome (CET)",
        format: "In-Person",
        venue: "Palazzo Ducale Grand Hall",
        address: "Piazza San Marco 1",
        city: "Venice",
        coordinates: { lat: 45.4337, lng: 12.3404 },
        previewImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80",
        ],
        qualityScore: 99,
        selectedTier: "VIP Experience",
        tierDetails: "Gondola arrival transfer, private balcony seating, and custom Venetian artisan mask.",
        agenda: "07:30 PM - Water Taxi & Gondola Red Carpet Arrival\n08:30 PM - Grand Ballroom Masquerade Procession\n09:30 PM - Imperial Banquet by Michelin Star Chefs\n11:30 PM - Midnight Waltz & Fireworks over the Grand Canal",
        privacy: "Public",
        organizer: organizer._id,
      },
      {
        title: "Haute Cuisine & Sommelier Masterclass",
        synopsis: "An intimate culinary exploration guided by legendary sommeliers and triple-starred chefs. Master the art of rare terroir pairings with artisanal vintages.",
        category: "Workshops",
        price: 220,
        tags: ["CULINARY", "TASTING", "WINE"],
        startDate: "2026-11-18",
        startTime: "17:00",
        endDate: "2026-11-18",
        endTime: "21:00",
        timezone: "America/New_York (EST)",
        format: "In-Person",
        venue: "Le Bernardin Private Salon",
        address: "155 W 51st Street",
        city: "New York",
        coordinates: { lat: 40.7614, lng: -73.9818 },
        previewImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80",
        ],
        qualityScore: 96,
        selectedTier: "Standard Admission",
        tierDetails: "Full 6-flight tasting course with take-home cellar guide and sommelier glassware.",
        agenda: "05:00 PM - Welcome Blanc de Blancs & Canapé Pairing\n06:00 PM - Terroir Mastery: Old World vs New World\n07:30 PM - Chef's Tasting Course\n09:00 PM - Digestif & Private Cellar Tour",
        privacy: "Public",
        organizer: organizer._id,
      },
      {
        title: "Sovereign Autumn Gala & Celebration",
        synopsis: "Set amid the sun-drenched hills of Tuscany, an imperial autumn celebration surrounded by vineyards, candle-lit courtyards, live opera, and timeless romance.",
        category: "Weddings",
        price: 180,
        tags: ["WEDDING", "CELEBRATION", "TUSCANY"],
        startDate: "2026-12-04",
        startTime: "16:00",
        endDate: "2026-12-04",
        endTime: "23:00",
        timezone: "Europe/Rome (CET)",
        format: "In-Person",
        venue: "Rosewood Castiglion Estate",
        address: "Località Castiglion del Bosco",
        city: "Montalcino",
        coordinates: { lat: 43.0560, lng: 11.4880 },
        previewImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&q=80",
        ],
        qualityScore: 97,
        selectedTier: "Guest Pass",
        tierDetails: "Estate admission, vineyard shuttle, and Tuscan banquet.",
        agenda: "04:00 PM - Garden Reception & Prosecco Spritz\n05:30 PM - Sunset Courtyard Ceremony\n07:00 PM - Alfresco Tuscan Dinner by Candlelight\n09:30 PM - Live Opera & Starlight Dancing",
        privacy: "Public",
        organizer: organizer._id,
      },
    ]);

    console.log(`🎟️ Creating booked tickets for attendee (${attendee.email})...`);
    // Book Symphony Under the Stars & Modern Perspectives Gallery for the attendee
    await Ticket.create([
      {
        event: events[0]._id,
        user: attendee._id,
        ticketType: "VIP Experience",
        quantity: 2,
        totalAmount: 306, // $85 * 1.8 * 2
        discountAmount: 0,
        paymentIntentId: "pi_seed_symphony_vip_" + Date.now(),
        isFreeTicket: false,
      },
      {
        event: events[1]._id,
        user: attendee._id,
        ticketType: "General Admission",
        quantity: 1,
        totalAmount: 0,
        discountAmount: 0,
        isFreeTicket: true,
      },
    ]);

    console.log("✅ Seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - 2 Users created (organizer@luxeevents.com, attendee@luxeevents.com [password: password123])`);
    console.log(`   - ${events.length} Real events created`);
    console.log(`   - 2 Real booked tickets created for attendee`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
