import { sampleItems } from "@/data/sampleItems";

// Works on sample data for now. Swap the body for
// fetch("/api/items", { method: "POST", ... }) once the backend is merged.
export async function createItem(item) {
  const created = { ...item, id: Date.now() };
  sampleItems.unshift(created);
  return created;
}
