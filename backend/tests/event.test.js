const request = require("supertest");
const app = require("../server");
const dbSetup = require("./db-setup");
const User = require("../models/User");
const Event = require("../models/Event");

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

// ─── Helper: Register + get token ────────────────────────────────────────────
const registerAndLogin = async (role = "organizer") => {
  const res = await request(app).post("/api/auth/register").send({
    name: "Test Organizer",
    email: `test_${Date.now()}@example.com`,
    password: "password123",
    role,
  });
  return { token: res.body.token, userId: res.body._id };
};

// ─── Helper: Create event ─────────────────────────────────────────────────────
const createTestEvent = async (token) => {
  const res = await request(app)
    .post("/api/events")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Test Gala Night",
      synopsis: "A beautiful test event for our platform.",
      category: "Gala & Dinners",
      price: 100,
      venue: "Test Venue Hall",
      startDate: "2027-01-01",
    });
  return res;
};

describe("Event API", () => {
  describe("POST /api/events", () => {
    it("should create an event when authenticated as organizer", async () => {
      const { token } = await registerAndLogin("organizer");
      const res = await createTestEvent(token);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe("Test Gala Night");
      expect(res.body.price).toBe(100);
    });

    it("should reject event creation without auth token", async () => {
      const res = await request(app).post("/api/events").send({
        title: "Unauthorized Event",
        synopsis: "This should fail.",
        venue: "Test",
        startDate: "2027-01-01",
      });
      expect(res.statusCode).toBe(401);
    });

    it("should reject event creation with missing required fields", async () => {
      const { token } = await registerAndLogin("organizer");
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Incomplete Event" }); // missing synopsis, venue, startDate
      expect(res.statusCode).toBe(400);
    });

    it("should reject negative price", async () => {
      const { token } = await registerAndLogin("organizer");
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Bad Price Event",
          synopsis: "Testing price validation.",
          venue: "Test Hall",
          startDate: "2027-01-01",
          price: -50,
        });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /api/events", () => {
    it("should return paginated events list", async () => {
      const res = await request(app).get("/api/events");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("events");
      expect(res.body).toHaveProperty("totalCount");
      expect(res.body).toHaveProperty("hasMore");
      expect(Array.isArray(res.body.events)).toBe(true);
    });

    it("should filter by category", async () => {
      const { token } = await registerAndLogin("organizer");
      await createTestEvent(token);

      const res = await request(app)
        .get("/api/events")
        .query({ category: "Gala & Dinners" });

      expect(res.statusCode).toBe(200);
      res.body.events.forEach((e) => {
        expect(e.category).toBe("Gala & Dinners");
      });
    });

    it("should search events by title keyword", async () => {
      const { token } = await registerAndLogin("organizer");
      await createTestEvent(token);

      const res = await request(app)
        .get("/api/events")
        .query({ search: "Gala Night" });

      expect(res.statusCode).toBe(200);
      expect(res.body.events.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/events/:id", () => {
    it("should return event by valid ID", async () => {
      const { token } = await registerAndLogin("organizer");
      const created = await createTestEvent(token);
      const eventId = created.body._id;

      const res = await request(app).get(`/api/events/${eventId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(eventId);
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app).get("/api/events/not-a-valid-id");
      expect(res.statusCode).toBe(400);
    });

    it("should return 404 for non-existent event", async () => {
      const res = await request(app).get("/api/events/6507f1f77bcf86cd799439aa");
      expect(res.statusCode).toBe(404);
    });
  });

  describe("PUT /api/events/:id", () => {
    it("should update event when authorized organizer", async () => {
      const { token } = await registerAndLogin("organizer");
      const created = await createTestEvent(token);
      const eventId = created.body._id;

      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Gala Night" });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Gala Night");
    });

    it("should not allow another user to update event", async () => {
      const { token: ownerToken } = await registerAndLogin("organizer");
      const created = await createTestEvent(ownerToken);
      const eventId = created.body._id;

      const { token: otherToken } = await registerAndLogin("organizer");
      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ title: "Hacked Title" });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("DELETE /api/events/:id", () => {
    it("should delete event when authorized", async () => {
      const { token } = await registerAndLogin("organizer");
      const created = await createTestEvent(token);
      const eventId = created.body._id;

      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.deletedId).toBe(eventId);
    });

    it("should not allow another user to delete event", async () => {
      const { token: ownerToken } = await registerAndLogin("organizer");
      const created = await createTestEvent(ownerToken);
      const eventId = created.body._id;

      const { token: otherToken } = await registerAndLogin("organizer");
      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
