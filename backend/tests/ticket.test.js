const request = require("supertest");
const app = require("../server");
const dbSetup = require("./db-setup");

jest.setTimeout(60000);

beforeAll(async () => {
  await dbSetup.connect();
});

afterEach(async () => {
  await dbSetup.clearDatabase();
});

afterAll(async () => {
  await dbSetup.closeDatabase();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const registerUser = async (role = "attendee") => {
  const res = await request(app).post("/api/auth/register").send({
    name: "Ticket Test User",
    email: `ticket_${Date.now()}_${Math.random()}@example.com`,
    password: "password123",
    role,
  });
  return { token: res.body.token, userId: res.body._id };
};

const createFreeEvent = async (token, maxTickets = null) => {
  const res = await request(app)
    .post("/api/events")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Free Ticket Test Event",
      synopsis: "A free event for testing.",
      venue: "Test Hall",
      startDate: "2027-06-15",
      price: 0,
      maxTickets,
    });
  return res.body._id;
};

const createPaidEvent = async (token) => {
  const res = await request(app)
    .post("/api/events")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Paid Test Event",
      synopsis: "A paid event for testing.",
      venue: "Paid Venue",
      startDate: "2027-06-20",
      price: 250,
    });
  return res.body._id;
};

describe("Ticket API — Free Registration", () => {
  describe("POST /api/tickets/free", () => {
    it("should register free ticket for authenticated user", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createFreeEvent(orgToken);

      const { token: userToken } = await registerUser("attendee");
      const res = await request(app)
        .post("/api/tickets/free")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ eventId, ticketType: "General", quantity: 1 });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.isFreeTicket).toBe(true);
      expect(res.body.totalAmount).toBe(0);
    });

    it("should reject free registration without auth", async () => {
      const { token } = await registerUser("organizer");
      const eventId = await createFreeEvent(token);

      const res = await request(app)
        .post("/api/tickets/free")
        .send({ eventId, ticketType: "General", quantity: 1 });

      expect(res.statusCode).toBe(401);
    });

    it("should reject duplicate free registration for same user", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createFreeEvent(orgToken);

      const { token: userToken } = await registerUser("attendee");

      // First registration
      await request(app)
        .post("/api/tickets/free")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ eventId, ticketType: "General", quantity: 1 });

      // Second registration — should fail
      const res = await request(app)
        .post("/api/tickets/free")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ eventId, ticketType: "General", quantity: 1 });

      expect(res.statusCode).toBe(409);
    });

    it("should reject free registration for a paid event", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createPaidEvent(orgToken);

      const { token: userToken } = await registerUser("attendee");
      const res = await request(app)
        .post("/api/tickets/free")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ eventId, ticketType: "General", quantity: 1 });

      expect(res.statusCode).toBe(400);
    });

    it("should respect maxTickets capacity limit", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createFreeEvent(orgToken, 1); // Only 1 ticket available

      const { token: user1Token } = await registerUser("attendee");
      const { token: user2Token } = await registerUser("attendee");

      // First user — should succeed
      const res1 = await request(app)
        .post("/api/tickets/free")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ eventId, ticketType: "General", quantity: 1 });
      expect(res1.statusCode).toBe(201);

      // Second user — should fail (sold out)
      const res2 = await request(app)
        .post("/api/tickets/free")
        .set("Authorization", `Bearer ${user2Token}`)
        .send({ eventId, ticketType: "General", quantity: 1 });
      expect(res2.statusCode).toBe(400);
      expect(res2.body.message).toMatch(/sold out/i);
    });

    it("should reject quantity exceeding remaining capacity", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createFreeEvent(orgToken, 2); // Only 2 spots

      const { token: userToken } = await registerUser("attendee");
      const res = await request(app)
        .post("/api/tickets/free")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ eventId, ticketType: "General", quantity: 5 }); // 5 > 2

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/remaining/i);
    });
  });

  describe("GET /api/tickets/mine", () => {
    it("should return user's tickets", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createFreeEvent(orgToken);

      const { token: userToken } = await registerUser("attendee");

      // Register for event
      await request(app)
        .post("/api/tickets/free")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ eventId, ticketType: "General", quantity: 1 });

      // Fetch tickets
      const res = await request(app)
        .get("/api/tickets/mine")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    it("should reject without auth", async () => {
      const res = await request(app).get("/api/tickets/mine");
      expect(res.statusCode).toBe(401);
    });
  });
});
