import request from "supertest";
import { createApp } from "../src/app.js";
import * as store from "../src/store/itemStore.js";
import { MAX_ATTEMPTS } from "../src/controllers/claimController.js";

const app = createApp();

// Item 2 in the sample data: found Blue Backpack, answer "Laptop charger"
const FOUND_ID = 2;
const LOST_ID = 1;

beforeEach(() => store.reset());

describe("POST /api/items/:id/claim", () => {
  test("correct answer shares the finder's contact", async () => {
    const res = await request(app).post(`/api/items/${FOUND_ID}/claim`).send({ answer: "Laptop charger" });
    expect(res.status).toBe(200);
    expect(res.body.contact).toBe("+250780000002");
  });

  test("answer ignores capital letters and extra spaces", async () => {
    const res = await request(app).post(`/api/items/${FOUND_ID}/claim`).send({ answer: "  LAPTOP   charger " });
    expect(res.status).toBe(200);
  });

  test("wrong answer is rejected and does not share the contact", async () => {
    const res = await request(app).post(`/api/items/${FOUND_ID}/claim`).send({ answer: "Books" });
    expect(res.status).toBe(403);
    expect(res.body.contact).toBeUndefined();
    expect(res.body.attemptsLeft).toBe(MAX_ATTEMPTS - 1);
  });

  test(`locks the item after ${MAX_ATTEMPTS} wrong answers`, async () => {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await request(app).post(`/api/items/${FOUND_ID}/claim`).send({ answer: "wrong" });
    }
    const res = await request(app).post(`/api/items/${FOUND_ID}/claim`).send({ answer: "Laptop charger" });
    expect(res.status).toBe(429);
    expect(res.body.contact).toBeUndefined();
  });

  test("missing answer returns 400", async () => {
    const res = await request(app).post(`/api/items/${FOUND_ID}/claim`).send({});
    expect(res.status).toBe(400);
  });

  test("lost items cannot be claimed", async () => {
    const res = await request(app).post(`/api/items/${LOST_ID}/claim`).send({ answer: "anything" });
    expect(res.status).toBe(400);
  });

  test("returned items cannot be claimed", async () => {
    store.update(FOUND_ID, { returned: true });
    const res = await request(app).post(`/api/items/${FOUND_ID}/claim`).send({ answer: "Laptop charger" });
    expect(res.status).toBe(409);
  });

  test("unknown item returns 404", async () => {
    const res = await request(app).post("/api/items/999/claim").send({ answer: "x" });
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/items/:id/returned", () => {
  test("marks the item as returned without leaking private fields", async () => {
    const res = await request(app).patch(`/api/items/${FOUND_ID}/returned`);
    expect(res.status).toBe(200);
    expect(res.body.returned).toBe(true);
    expect(res.body.returnedAt).toBeDefined();
    expect(res.body.answer).toBeUndefined();
    expect(res.body.contact).toBeUndefined();
    expect(store.getById(FOUND_ID).returned).toBe(true);
  });

  test("cannot be returned twice", async () => {
    await request(app).patch(`/api/items/${FOUND_ID}/returned`);
    const res = await request(app).patch(`/api/items/${FOUND_ID}/returned`);
    expect(res.status).toBe(409);
  });

  test("unknown item returns 404", async () => {
    const res = await request(app).patch("/api/items/999/returned");
    expect(res.status).toBe(404);
  });
});
