import request from "supertest";
import { createApp } from "../src/app.js";
import * as store from "../src/store/itemStore.js";

const app = createApp();

// Returns just the ids of the items in a response, easy to compare
function ids(res) {
  return res.body.map((item) => item.id).sort((a, b) => a - b);
}

beforeEach(() => {
  store.reset();
});

describe("GET /api/items", () => {
  it("lists all items when no filter is given", async () => {
    const res = await request(app).get("/api/items");

    expect(res.status).toBe(200);
    expect(ids(res)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("never sends the answer or contact", async () => {
    const res = await request(app).get("/api/items");

    for (const item of res.body) {
      expect(item.answer).toBeUndefined();
      expect(item.contact).toBeUndefined();
    }
  });

  it("filters by status", async () => {
    const lost = await request(app).get("/api/items?status=lost");
    const found = await request(app).get("/api/items?status=found");

    expect(ids(lost)).toEqual([1, 4, 6]);
    expect(ids(found)).toEqual([2, 3, 5]);
  });

  it("filters by category", async () => {
    const res = await request(app).get("/api/items?category=electronics");
    expect(ids(res)).toEqual([1, 5]);
  });

  it("ignores upper and lower case in filters", async () => {
    const res = await request(app).get("/api/items?status=LOST&category=Documents");
    expect(ids(res)).toEqual([4]);
  });

  it("filters by location with a partial match", async () => {
    const res = await request(app).get("/api/items?location=room");
    expect(ids(res)).toEqual([1, 2, 4]);
  });

  it("filters by date", async () => {
    const res = await request(app).get("/api/items?date=2026-10-20");
    expect(ids(res)).toEqual([3]);
  });

  it("searches words in the title with q", async () => {
    const wallet = await request(app).get("/api/items?q=wallet");
    const keys = await request(app).get("/api/items?q=KEYS");

    expect(ids(wallet)).toEqual([6]);
    expect(ids(keys)).toEqual([3]);
  });

  it("searches words in the description with q", async () => {
    store.update(4, { description: "Has a blue lanyard" });

    const res = await request(app).get("/api/items?q=lanyard");
    expect(ids(res)).toEqual([4]);
  });

  it("searches the location with q, so one search box covers title and location", async () => {
    const res = await request(app).get("/api/items?q=cafeteria");
    expect(ids(res)).toEqual([6]);
  });

  it("combines several filters", async () => {
    const res = await request(app).get("/api/items?status=found&category=electronics");
    expect(ids(res)).toEqual([5]);
  });

  it("returns an empty list when nothing matches", async () => {
    const res = await request(app).get("/api/items?category=furniture");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("filters by returned", async () => {
    store.update(2, { returned: true });

    const returned = await request(app).get("/api/items?returned=true");
    const open = await request(app).get("/api/items?returned=false");

    expect(ids(returned)).toEqual([2]);
    expect(open.body).toHaveLength(5);
  });

  it("rejects an invalid status", async () => {
    const res = await request(app).get("/api/items?status=stolen");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/lost.*found/);
  });

  it("rejects a date in the wrong format", async () => {
    const res = await request(app).get("/api/items?date=20-10-2026");
    expect(res.status).toBe(400);
  });

  it("rejects an invalid returned value", async () => {
    const res = await request(app).get("/api/items?returned=maybe");
    expect(res.status).toBe(400);
  });
});