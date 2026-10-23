import { seedItems } from "../data/seedItems.js";

// In-memory storage. Every other file talks to items only through these
// functions, so we can swap this for a real database later without
// changing the routes or controllers.
let items = [];
let nextId = 1;

export function reset(data = seedItems) {
  items = data.map((item) => ({ returned: false, ...item }));
  nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
}

export function getAll() {
  return items;
}

export function getById(id) {
  return items.find((item) => item.id === Number(id));
}

export function add(item) {
  const created = { ...item, id: nextId++, returned: false };
  items.unshift(created);
  return created;
}

export function update(id, changes) {
  const item = getById(id);
  if (!item) return undefined;
  Object.assign(item, changes);
  return item;
}

reset();
