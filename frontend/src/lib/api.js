import { sampleItems } from "@/data/sampleItems";

// Set in frontend/.env (see .env.example)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Sends a request to the backend and returns the JSON body.
// Throws an Error with the backend's message when the request fails,
// so pages can show it to the user.
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || "Something went wrong");
    error.status = res.status;
    error.attemptsLeft = data.attemptsLeft;
    throw error;
  }
  return data;
}

// Works on sample data for now. Switch to
// request("/items", { method: "POST", body: JSON.stringify(item) })
// once POST /api/items is built.
export async function createItem(item) {
  const created = { ...item, id: Date.now() };
  sampleItems.unshift(created);
  return created;
}

// Returns { message, contact } when the answer is correct.
// Throws with error.attemptsLeft when it is wrong.
export function claimItem(id, answer) {
  return request(`/items/${id}/claim`, { method: "POST", body: JSON.stringify({ answer }) });
}

export function markReturned(id) {
  return request(`/items/${id}/returned`, { method: "PATCH" });
}
