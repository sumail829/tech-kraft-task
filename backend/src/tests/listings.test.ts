import "reflect-metadata";
import request from "supertest";
import express from "express";
import { AppDataSource } from "../config/data-source";
import { authMiddleware } from "../middleware/auth";
import listingsRouter from "../routes/listing";

const app = express();
app.use(express.json());
app.use(authMiddleware);
app.use("/listings", listingsRouter);

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

// ─── Test 1: GET /listings returns paginated results ─────────────────────────
describe("GET /listings", () => {
  it("should return paginated results with meta", async () => {
    const res = await request(app).get("/listings");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("meta");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toMatchObject({
      page: 1,
      limit: 10,
    });
    expect(typeof res.body.meta.total).toBe("number");
    expect(typeof res.body.meta.totalPages).toBe("number");
  });

  it("should filter by suburb (case-insensitive)", async () => {
    const res = await request(app).get("/listings?suburb=northside");

    expect(res.status).toBe(200);
    res.body.data.forEach((p: any) => {
      expect(p.suburb.toLowerCase()).toBe("northside");
    });
  });

  it("should filter by price range", async () => {
    const res = await request(app).get(
      "/listings?price_min=500000&price_max=1000000"
    );

    expect(res.status).toBe(200);
    res.body.data.forEach((p: any) => {
      expect(p.price).toBeGreaterThanOrEqual(500000);
      expect(p.price).toBeLessThanOrEqual(1000000);
    });
  });

  it("should filter by property type", async () => {
    const res = await request(app).get("/listings?type=apartment");

    expect(res.status).toBe(200);
    res.body.data.forEach((p: any) => {
      expect(p.propertyType.toLowerCase()).toBe("apartment");
    });
  });

  it("should respect pagination params", async () => {
    const res = await request(app).get("/listings?page=1&limit=2");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.meta.limit).toBe(2);
    expect(res.body.meta.page).toBe(1);
  });
});

// ─── Test 2: Role-based access (admin vs non-admin) ──────────────────────────
describe("Role-based access: internalStatusNotes", () => {
  it("should NOT expose internalStatusNotes to non-admin users", async () => {
    const res = await request(app).get("/listings");

    expect(res.status).toBe(200);
    res.body.data.forEach((p: any) => {
      expect(p).not.toHaveProperty("internalStatusNotes");
    });
  });

  it("should expose internalStatusNotes to admin users", async () => {
    const res = await request(app)
      .get("/listings")
      .set("x-admin", "true");

    expect(res.status).toBe(200);
    res.body.data.forEach((p: any) => {
      expect(p).toHaveProperty("internalStatusNotes");
    });
  });
});

// ─── Test 3: GET /listings/:id ────────────────────────────────────────────────
describe("GET /listings/:id", () => {
  it("should return a single property by id", async () => {
    const res = await request(app).get("/listings/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("price");
    expect(res.body).toHaveProperty("agent");
  });

  it("should return 404 for a non-existent property", async () => {
    const res = await request(app).get("/listings/999999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Property not found");
  });

  it("should return 400 for an invalid id", async () => {
    const res = await request(app).get("/listings/abc");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid ID");
  });

  it("should hide internalStatusNotes for non-admin on detail page", async () => {
    const res = await request(app).get("/listings/1");

    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty("internalStatusNotes");
  });

  it("should show internalStatusNotes for admin on detail page", async () => {
    const res = await request(app).get("/listings/1").set("x-admin", "true");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("internalStatusNotes");
  });
});