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
    name: "Test User",
    email: `user_${Date.now()}_${Math.random()}@example.com`,
    password: "password123",
    role,
  });
  return { token: res.body.token, userId: res.body._id };
};

const createEvent = async (token) => {
  const res = await request(app)
    .post("/api/events")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Review Test Event",
      synopsis: "This is a test event for reviews.",
      venue: "Test Venue",
      startDate: "2025-01-01", // Past event — reviewable
    });
  return res.body._id;
};

describe("Review API", () => {
  describe("GET /api/reviews/:eventId", () => {
    it("should return empty reviews for new event", async () => {
      const { token } = await registerUser("organizer");
      const eventId = await createEvent(token);

      const res = await request(app).get(`/api/reviews/${eventId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("should return 400 for invalid event ID", async () => {
      const res = await request(app).get("/api/reviews/invalid-id");
      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/reviews/:eventId", () => {
    it("should create a review when authenticated", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createEvent(orgToken);

      const { token: userToken } = await registerUser("attendee");
      const res = await request(app)
        .post(`/api/reviews/${eventId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 5, comment: "Amazing event! Highly recommend." });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("rating", 5);
      expect(res.body).toHaveProperty("comment");
    });

    it("should reject review without auth", async () => {
      const { token } = await registerUser("organizer");
      const eventId = await createEvent(token);

      const res = await request(app)
        .post(`/api/reviews/${eventId}`)
        .send({ rating: 4, comment: "Great!" });

      expect(res.statusCode).toBe(401);
    });

    it("should reject duplicate review from same user", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createEvent(orgToken);

      const { token: userToken } = await registerUser("attendee");

      // First review
      await request(app)
        .post(`/api/reviews/${eventId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 5, comment: "First review." });

      // Second review — should fail
      const res = await request(app)
        .post(`/api/reviews/${eventId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 3, comment: "Second review." });

      expect(res.statusCode).toBe(409);
    });

    it("should reject invalid rating (out of 1-5 range)", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createEvent(orgToken);

      const { token: userToken } = await registerUser("attendee");
      const res = await request(app)
        .post(`/api/reviews/${eventId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 10, comment: "Invalid rating." });

      expect(res.statusCode).toBe(400);
    });

    it("should reject review without comment", async () => {
      const { token: orgToken } = await registerUser("organizer");
      const eventId = await createEvent(orgToken);

      const { token: userToken } = await registerUser("attendee");
      const res = await request(app)
        .post(`/api/reviews/${eventId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 4 }); // no comment

      expect(res.statusCode).toBe(400);
    });
  });
});
