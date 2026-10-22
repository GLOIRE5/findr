import { useMemo, useState } from "react";
import { sampleItems } from "../data/sampleItems";

const categories = ["electronics", "documents", "accessories", "clothing", "other"];

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
    <div className="items-page-wrapper">
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">
            Lost something?<br />We'll help you find it.
          </h1>
          <p className="hero-subtitle">
            Report lost or found items and reconnect your campus community with their belongings.
          </p>

          <div className="hero-search-wrapper">
            <input
              className="hero-search-input search-input"
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="hero-filters filters">
            <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <main id="items" className="items-page items-main scroll-mt-16">
        {items.length === 0 ? (
          <p className="no-items">No items match your search.</p>
        ) : (
          <ul className="items-grid">
            {items.map((item) => (
              <li key={item.id} className={`item-card ${item.status}`}>
                <span className="badge">{item.status}</span>
                <h3 className="item-title">{item.title}</h3>
                <div className="item-details">
                  <span className="item-location">
                    <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {item.location}
                  </span>
                  <span className="item-date">
                    <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    {item.date}
                  </span>
                </div>
                <p className="item-category-chip">{item.category}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}