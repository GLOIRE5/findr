import request from "supertest";
import { createApp } from "../src/app.js";

describe("CORS", () => {
  const original = process.env.CORS_ORIGIN;
  afterEach(() => {
    process.env.CORS_ORIGIN = original;
  });

  test("allows the frontend address", async () => {
    process.env.CORS_ORIGIN = "http://localhost:5173";
    const res = await request(createApp()).get("/api/health").set("Origin", "http://localhost:5173");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  test("does not allow other websites", async () => {
    process.env.CORS_ORIGIN = "http://localhost:5173";
    const res = await request(createApp()).get("/api/health").set("Origin", "http://evil.example");
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
