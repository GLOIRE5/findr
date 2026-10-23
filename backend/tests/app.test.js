import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

describe("App setup", () => {
  test("GET /api/health says the API is running", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("unknown routes return 404 as JSON", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Route not found");
  });

  test("bad JSON returns 400, not a crash", async () => {
    const res = await request(app)
      .post("/api/items")
      .set("Content-Type", "application/json")
      .send("{ not json");
    expect(res.status).toBe(400);
  });
});
