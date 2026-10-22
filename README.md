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
| Frontend | React 18 |
| Backend | Node.js and Express |
| Database | SQLite (development), PostgreSQL (production) |
| Testing | Jest and Supertest |
| CI/CD | GitHub Actions |
| Containers | Docker (Formative 2) |
| Cloud deployment | (Formative 3) |

---

## Getting Started

### What you need

- [Node.js](https://nodejs.org/) version 18 or higher
- npm version 9 or higher

### Install and run

```bash
# 1. Download the code
git clone https://github.com/GLOIRE5/findr.git
cd findr

# 2. Install packages
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Start the server
npm run dev
```

The API runs at `http://localhost:3000`.

### Run the tests

```bash
npm test
```

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
│       └── ci.yml          # CI pipeline (GitHub Actions)
├── src/
│   ├── routes/             # API routes
│   ├── models/             # Data models
│   └── app.js              # Main app file
├── tests/                  # Tests
├── .env.example            # Example environment variables
├── .gitignore
├── package.json
├── LICENSE
└── README.md
```

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
