import * as store from "../src/store/itemStore.js";
import { publicItem } from "../src/utils/publicItem.js";

beforeEach(() => store.reset());

describe("itemStore", () => {
  test("starts with the sample items", () => {
    expect(store.getAll()).toHaveLength(6);
  });

  test("finds an item by id, given as a number or a string", () => {
    expect(store.getById(1).title).toBe("Black iPhone 12");
    expect(store.getById("1").title).toBe("Black iPhone 12");
    expect(store.getById(999)).toBeUndefined();
  });

  test("adds new items first, with a new id", () => {
    const created = store.add({ title: "Red Umbrella", status: "found" });
    expect(created.id).toBe(7);
    expect(created.returned).toBe(false);
    expect(store.getAll()[0]).toBe(created);
  });

  test("updates an item", () => {
    store.update(2, { returned: true });
    expect(store.getById(2).returned).toBe(true);
    expect(store.update(999, { returned: true })).toBeUndefined();
  });
});

describe("publicItem", () => {
  test("hides the answer and contact but keeps the question", () => {
    const item = publicItem(store.getById(2));
    expect(item.answer).toBeUndefined();
    expect(item.contact).toBeUndefined();
    expect(item.question).toBe("What's inside it?");
    expect(item.hasQuestion).toBe(true);
  });
});
