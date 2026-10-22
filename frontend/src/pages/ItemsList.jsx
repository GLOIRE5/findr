import { useMemo, useState } from "react";
import { sampleItems } from "../data/sampleItems";

const categories = ["phone", "bag", "keys", "documents", "wallet"];

export default function ItemsList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sampleItems.filter(
      (item) =>
        (!q || item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q)) &&
        (!status || item.status === status) &&
        (!category || item.category === category)
    );
  }, [search, status, category]);

  return (
    <div className="items-page">
      <h1>Findr</h1>
      <p>Search lost and found items</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <p>No items match your search.</p>
      ) : (
        <ul className="items-grid">
          {items.map((item) => (
            <li key={item.id} className={`item-card ${item.status}`}>
              <span className="badge">{item.status}</span>
              <h3>{item.title}</h3>
              <p>{item.category} · {item.location}</p>
              <small>{item.date}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}