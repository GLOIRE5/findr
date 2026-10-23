# Findr

> A simple lost and found app for the ALU campus.

[![Node.js CI](https://github.com/GLOIRE5/findr/actions/workflows/ci.yml/badge.svg)](https://github.com/GLOIRE5/findr/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## African Context

On many African campuses, ALU included, lost and found happens in WhatsApp groups. Posts get buried under hundreds of new messages within hours, old posts can't be searched, and nobody knows if an item was ever returned.

Losing an item is expensive for students. A lost phone often means a lost mobile money (MoMo) wallet and SIM card. A lost ID, student card, or laptop charger can take weeks and money to replace. People who find items also have no safe way to return them.

Findr gives the campus one place to post and search lost and found items. Owners answer a question about the item before they can claim it, so items go back to the right person. It is built for phones, uses little data, and works with the tools students already use: finders can share a post straight to WhatsApp.

## Team Members

- Bonae - Backend developer
- Gloire - Backend developer
- Norette - Frontend developer
- Shina - Frontend developer

## Project Overview

Findr is a web app where anyone on campus can report something they lost or found. Each post has a category, where and when it happened, and a way to reach the person who posted it. Everyone else can browse the board, search by name or place, and filter by status and category.

When someone posts a found item, they set a secret question that only the real owner could answer, such as "What's the lock screen photo?". The finder's contact is only shown to someone who answers it correctly. Once the item is back with its owner, the post is marked as returned.

The app has two parts: a Node.js and Express API that stores items and checks claims, and a React website that talks to it.

### Target Users

- **Students and staff who lost something:** a quick way to check if someone found their item.
- **Finders:** a safe and easy way to return an item without sharing their number publicly.
- **Campus security and admin:** a clear record of items handed in to them.

### Core Features

- **Report an item:** post a lost or found item with its category, campus location, date, and contact (WhatsApp or email). Share the post to WhatsApp in one tap.
- **Search and filter:** find items by name or location, and filter by status and category.
- **Verified claims:** the finder sets a secret question, and their contact is shared only after the right answer.
- **Mark as returned:** close a post once the item is back with its owner.
- **Alerts (planned):** get an SMS or WhatsApp message when a found item matches your lost item.

## Technology Stack

- **Backend**: Node.js 22 and Express 5
- **Frontend**: React 19, Vite, React Router, Tailwind CSS, shadcn/ui
- **Database**: In-memory for now, PostgreSQL later
- **Other**: Jest and Supertest (backend tests), ESLint (frontend), GitHub Actions (CI), Docker (Formative 2)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22.9 or higher
- npm 10 or higher
- Git

### Installation

1. Clone the repository
```bash
   git clone https://github.com/GLOIRE5/findr.git
   cd findr
```

2. Install and start the backend (API)
```bash
   cd backend
   npm install
   cp .env.example .env    # optional, only if you want to change the port
   npm run dev
```
   The API runs at `http://localhost:3000`. Open `http://localhost:3000/api/health` to check it works.

3. Run the application: in a second terminal, install and start the frontend
```bash
   cd frontend
   npm install
   npm run dev
```
   The website runs at `http://localhost:5173`.

To run the checks that CI runs on every pull request:
```bash
   cd backend && npm test
   cd ../frontend && npm run lint && npm run build
```

### Usage

1. Open `http://localhost:5173` to see the board of lost and found items. Search by name or place, or filter by status and category.
2. Click **Report item**, choose **I lost something** or **I found something**, and fill in the form. Finders pick or write a secret question for the owner.
3. After posting, share the item to WhatsApp or copy its link.

The frontend uses these API endpoints:

| Method | Endpoint | What it does |
|--------|----------|--------------|
| `GET` | `/api/items` | List items (filter with `?status=lost&category=electronics&location=Library`) |
| `POST` | `/api/items` | Report a lost or found item |
| `GET` | `/api/items/:id` | Get one item |
| `POST` | `/api/items/:id/claim` | Claim an item by answering its question |
| `PATCH` | `/api/items/:id/returned` | Mark an item as returned |

## Project Structure

```
findr/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI: backend tests, frontend lint and build
├── backend/                    # API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/        # Report, search and claim logic
│   │   ├── data/               # Seed items
│   │   ├── routes/             # API routes
│   │   ├── store/              # Item storage (in-memory for now)
│   │   ├── utils/              # Helpers, e.g. hiding private fields
│   │   ├── app.js              # Builds the Express app
│   │   └── index.js            # Starts the server
│   ├── tests/                  # Jest + Supertest tests
│   └── .env.example            # Example environment variables
├── frontend/                   # Website (React + Vite)
│   └── src/
│       ├── components/         # Header, chips, success screen
│       │   └── ui/             # shadcn/ui components
│       ├── data/               # Sample items and form options
│       ├── lib/                # API calls and helpers
│       └── pages/              # Items list, report form
├── LICENSE
└── README.md
```

## Links

- [Project Board](https://github.com/GLOIRE5/findr/projects)
- [CI runs](https://github.com/GLOIRE5/findr/actions)
- [Branch protection rules](./docs/branch-protection.md)

## License

MIT License. See the [LICENSE](./LICENSE) file.
