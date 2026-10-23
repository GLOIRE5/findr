# Findr

> **A simple lost and found app for the ALU campus.**

[![Node.js CI](https://github.com/GLOIRE5/findr/actions/workflows/ci.yml/badge.svg)](https://github.com/GLOIRE5/findr/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Problem Statement

At ALU, students post lost and found items in WhatsApp groups. These posts get lost under hundreds of new messages in a few hours. You cannot search old posts, and nobody knows if an item was returned.

Losing an item is expensive for students. A lost phone can mean a lost MoMo wallet and SIM card. A lost ID, student card, or laptop charger can take weeks and money to replace. People who find items also have no safe way to return them.

**Findr** gives the campus one place to post and search lost and found items. Owners must answer a question about the item before they can claim it, so items go back to the right person. The app works well on phones and uses little data.

---

## Target Users

| User | What they need |
|------|----------------|
| **Students and staff who lost something** | A quick way to check if someone found their item |
| **Finders** | A safe and easy way to return an item |
| **Campus security and admin** | A clear record of items handed in to them |

---

## Core Features

1. **Report an item:** Post a lost or found item with its category (phone, ID, laptop, keys), location on campus, date, and description.
2. **Search and filter:** Find items by category, location, date, or status.
3. **Verified claims:** The finder sets a private question (for example, *"What is your lock screen picture?"*). Contact details are shared only after the right answer.
4. **Mark as returned:** Close a post once the item is back with its owner.
5. **Alerts:** Get an SMS or WhatsApp message when a found item matches your lost item.

---

## Technology Stack

| Part | Technology |
|------|------------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Node.js and Express |
| Database | In-memory for now, PostgreSQL later |
| Testing | Jest and Supertest (backend), ESLint (frontend) |
| CI/CD | GitHub Actions |
| Containers | Docker (Formative 2) |
| Cloud deployment | (Formative 3) |

---

## Getting Started

### What you need

- [Node.js](https://nodejs.org/) version 22.9 or higher
- npm version 10 or higher

Findr has two parts: the **backend** (the API) and the **frontend** (the website). Run each one in its own terminal.

### 1. Download the code

```bash
git clone https://github.com/GLOIRE5/findr.git
cd findr
```

### 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env    # optional, only if you want to change the port
npm run dev
```

The API runs at `http://localhost:3000`. Open `http://localhost:3000/api/health` to check it works.

### 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The website runs at `http://localhost:5173`.

### Run the tests

```bash
cd backend
npm test
```

For the frontend, run `npm run lint` and `npm run build` inside `frontend/`.

CI runs all of these on every pull request.

### API Endpoints (v1)

| Method | Endpoint | What it does |
|--------|----------|--------------|
| `GET` | `/api/items` | List all items (filter with `?status=lost&category=phone`) |
| `POST` | `/api/items` | Report a lost or found item |
| `GET` | `/api/items/:id` | Get one item |
| `POST` | `/api/items/:id/claim` | Claim an item by answering its question |
| `PATCH` | `/api/items/:id/returned` | Mark an item as returned |

---

## Project Structure

```
findr/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI: backend tests, frontend lint and build
├── backend/                    # API service (Node.js + Express)
│   ├── src/
│   │   ├── controllers/        # One file per feature
│   │   ├── data/               # Sample items
│   │   ├── routes/             # API routes
│   │   ├── store/              # Data storage (in-memory for now)
│   │   ├── utils/              # Helpers (e.g. hide private fields)
│   │   ├── app.js              # Builds the Express app
│   │   └── index.js            # Starts the server
│   ├── tests/                  # Jest + Supertest tests
│   ├── .env.example            # Example environment variables
│   └── package.json
├── frontend/                   # Website (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI parts
│   │   ├── data/               # Sample data and form options
│   │   ├── lib/                # API calls and helpers
│   │   └── pages/              # Items list, report form
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

The backend and frontend are separate services, each with its own `package.json`. Later, each one gets its own Docker container.

---

## How to Contribute

1. Create a new branch from `main`: `git checkout -b feature/your-feature`
2. Make your changes and commit them with clear messages.
3. Open a Pull Request. At least 1 team member must review and approve it.
4. All CI checks must pass before you merge.

See our [GitHub Projects board](https://github.com/GLOIRE5/findr/projects) for open tasks.

---

## License

This project uses the MIT License. See the [LICENSE](./LICENSE) file.
