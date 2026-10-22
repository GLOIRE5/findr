# 📍 Findr

> **Campus lost & found that doesn''t get buried in the group chat.**

[![Node.js CI](https://github.com/GLOIRE5/findr/actions/workflows/ci.yml/badge.svg)](https://github.com/GLOIRE5/findr/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🧩 Problem Statement

At ALU, lost and found runs through scattered WhatsApp groups. A *"found: black phone near the library"* post gets buried under hundreds of messages within hours. Nobody can search old posts, and nobody knows whether an item was ever returned.

Losing things costs students a lot. A lost phone often means a lost MoMo wallet and SIM. A lost national ID, student card, or laptop charger can take weeks and real money to replace. Honest finders also have no easy way to return items safely, so many valuables never make it back to their owners.

**Findr** gives the campus one searchable place to report lost and found items. Its verification step ensures items go back to their real owners. Built mobile-first and lightweight for students on limited data.

---

## 👥 Target Users

| User Type | Description |
|-----------|-------------|
| **Students / Staff (lost something)** | Need a fast way to check whether anyone found their item |
| **Finders** | Picked up something and want a safe, easy way to return it |
| **Campus Security / Admin** | Hold handed-in items and want an organised record |

---

## ✨ Core Features

1. **📝 Report an Item** — Post a lost or found item with category (phone, ID, laptop, keys…), campus location, date, and description
2. **🔍 Search & Filter** — Browse listings by category, location, date, and status — no more scrolling through group chats
3. **✅ Verified Claims** — Finder sets a private verification question (e.g. *"What''s your lock screen image?"*); contact details shared only after a correct answer
4. **✔️ Mark as Returned** — Close a listing once the item is returned, keeping the board accurate
5. **🔔 Alerts** — SMS/WhatsApp notifications when a found item matches your lost report (using numbers students already use)

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| Backend | Node.js + Express |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Testing | Jest + Supertest |
| CI/CD | GitHub Actions |
| Containerisation | Docker (Formative 2) |
| Cloud Deploy | (Formative 3) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/GLOIRE5/findr.git
cd findr

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your values if needed

# 4. Start the development server
npm run dev
```

The API will be available at `http://localhost:3000`.

### Running Tests

```bash
npm test
```

### API Endpoints (v1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/items` | List all items (supports `?status=lost&category=phone`) |
| `POST` | `/api/items` | Report a new lost or found item |
| `GET` | `/api/items/:id` | Get a single item by ID |
| `POST` | `/api/items/:id/claim` | Submit a claim with verification answer |
| `PATCH` | `/api/items/:id/returned` | Mark an item as returned |

---

## 📁 Project Structure

```
findr/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI pipeline
├── src/
│   ├── routes/             # Express route handlers
│   ├── models/             # Data models
│   └── app.js              # Express app entry point
├── tests/                  # Jest test files
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
├── LICENSE
└── README.md
```

---

## 🤝 Contributing

1. Create a feature branch from `main`: `git checkout -b feature/your-feature`
2. Make your changes and commit them with clear messages
3. Open a Pull Request — at least 1 team member must review and approve
4. All CI checks must pass before merging

See our [GitHub Projects board](https://github.com/GLOIRE5/findr/projects) for open tasks.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Team

Built by students at the African Leadership University (ALU) as part of the DevOps 2025 course.
