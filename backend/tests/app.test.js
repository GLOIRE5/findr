import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
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

describe("Serving the website (STATIC_DIR)", () => {
  let dir;
  let siteApp;

  beforeAll(() => {
    dir = mkdtempSync(path.join(tmpdir(), "findr-site-"));
    writeFileSync(path.join(dir, "index.html"), "<h1>Findr</h1>");
    siteApp = createApp({ staticDir: dir });
  });

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  test("serves index.html at /", async () => {
    const res = await request(siteApp).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Findr");
  });

  test("serves index.html for React pages like /items/3", async () => {
    const res = await request(siteApp).get("/items/3");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Findr");
  });

  test("API routes still work and unknown API routes are still 404", async () => {
    expect((await request(siteApp).get("/api/health")).status).toBe(200);
    expect((await request(siteApp).get("/api/nope")).status).toBe(404);
  });
});
