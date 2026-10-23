import request from "supertest";
import { createApp } from "../src/app.js";
import * as store from "../src/store/itemStore.js";

const app = createApp();

const lostItem = {
  title: "Black Umbrella",
  category: "accessories",
  status: "lost",
  location: "Library",
  date: "2026-10-22",
  contact: "+250780000099",
};

const foundItem = {
  title: "Grey Hoodie",
  category: "clothing",
  status: "found",
  location: "Cafeteria",
  date: "2026-10-22",
  contact: "+250780000098",
  question: "What is in the left pocket?",
  answer: "A pen",
};

beforeEach(() => {
  store.reset();
});

describe("POST /api/items", () => {
  it("reports a lost item and returns it without private fields", async () => {
    const res = await request(app).post("/api/items").send(lostItem);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe("Black Umbrella");
    expect(res.body.status).toBe("lost");
    expect(res.body.returned).toBe(false);
    expect(res.body.hasQuestion).toBe(false);
    expect(res.body.contact).toBeUndefined();
  });

  it("reports a found item and never returns the answer", async () => {
    const res = await request(app).post("/api/items").send(foundItem);

    expect(res.status).toBe(201);
    expect(res.body.hasQuestion).toBe(true);
    expect(res.body.question).toBe("What is in the left pocket?");
    expect(res.body.answer).toBeUndefined();
    expect(res.body.contact).toBeUndefined();
  });

  it("adds the item to the store", async () => {
    const before = store.getAll().length;
    await request(app).post("/api/items").send(lostItem);
    expect(store.getAll().length).toBe(before + 1);
  });

  it("trims spaces and lowercases category and status", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ ...lostItem, title: "  Black Umbrella  ", category: " Accessories ", status: "LOST" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Black Umbrella");
    expect(res.body.category).toBe("accessories");
    expect(res.body.status).toBe("lost");
  });

  it("ignores id and returned sent by the client", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ ...lostItem, id: 999, returned: true });

    expect(res.status).toBe(201);
    expect(res.body.id).not.toBe(999);
    expect(res.body.returned).toBe(false);
  });

  it.each([
    ["title", "Title is required"],
    ["category", "Category is required"],
    ["location", "Location is required"],
    ["date", "Date is required"],
    ["contact", "Contact is required"],
  ])("rejects a missing %s", async (field, message) => {
    const body = { ...lostItem };
    delete body[field];

    const res = await request(app).post("/api/items").send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(message);
  });

  it("rejects an invalid status", async () => {
    const res = await request(app).post("/api/items").send({ ...lostItem, status: "stolen" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/lost.*found/);
  });

  it("rejects a title that is not text", async () => {
    const res = await request(app).post("/api/items").send({ ...lostItem, title: 123 });
    expect(res.status).toBe(400);
  });

  it("rejects a date in the wrong format or a fake date", async () => {
    const badFormat = await request(app).post("/api/items").send({ ...lostItem, date: "22/10/2026" });
    const fakeDate = await request(app).post("/api/items").send({ ...lostItem, date: "2026-02-31" });

    expect(badFormat.status).toBe(400);
    expect(fakeDate.status).toBe(400);
  });

  it("rejects a found item without a question or answer", async () => {
    const noQuestion = await request(app)
      .post("/api/items")
      .send({ ...foundItem, question: "" });
    const noAnswer = await request(app)
      .post("/api/items")
      .send({ ...foundItem, answer: "" });

    expect(noQuestion.status).toBe(400);
    expect(noAnswer.status).toBe(400);
  });

  it("rejects an empty request body", async () => {
    const res = await request(app).post("/api/items").send();
    expect(res.status).toBe(400);
  });
});

describe("GET /api/items/:id", () => {
  it("returns one item without private fields", async () => {
    const res = await request(app).get("/api/items/2");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.title).toBe("Blue Backpack");
    expect(res.body.hasQuestion).toBe(true);
    expect(res.body.answer).toBeUndefined();
    expect(res.body.contact).toBeUndefined();
  });

  it("returns the item that was just reported", async () => {
    const created = await request(app).post("/api/items").send(lostItem);
    const res = await request(app).get(`/api/items/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Black Umbrella");
  });

  it("returns 404 when the item does not exist", async () => {
    const res = await request(app).get("/api/items/9999");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Item not found");
  });

  it("returns 404 when the id is not a number", async () => {
    const res = await request(app).get("/api/items/abc");
    expect(res.status).toBe(404);
  });
});