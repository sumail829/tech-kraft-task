# Real Estate Listing Search API

A full-stack real estate listing platform with a REST API backend (Node.js + TypeORM + PostgreSQL) and a Next.js frontend.

---

## Tech Stack

- **Backend:** Node.js, Express 5, TypeScript, TypeORM
- **Database:** PostgreSQL 15
- **Frontend:** Next.js (see `/frontend`)
- **Containerisation:** Docker + Docker Compose

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed

### 1. Clone the repo

```bash
git clone https://github.com/sumail829/tech-kraft-task.git
cd tech-kraft-task
```

### 2. Create the backend `.env` file

Create a file at `backend/.env`:

```env
PORT=5000
DB_HOST=db
DB_PORT=5432
DB_USER=suman

DB_PASSWORD=postgres
DB_NAME=realestate
```

### 3. Start the services

```bash
docker compose up --build
```

This starts:
- `db` — PostgreSQL on port `5432`
- `backend` — Express API on port `5000`

### 4. Run migrations

Once the containers are running, open a new terminal and run:

```bash
docker compose exec backend npm run migration:run
```

### 5. Seed the database

```bash
docker compose exec backend npm run seed
```

This inserts 4 agents and 12 properties.

---

## Running Tests

Tests use Jest + Supertest and connect to the real database, so make sure the DB is running and seeded first.

```bash
docker compose exec backend npm test
```

---

## API Reference

### Base URL

```
http://localhost:5000
```

### Authentication

Role is determined by the `x-admin` request header:

| Header | Value | Role |
|---|---|---|
| `x-admin` | `true` | Admin — sees `internalStatusNotes` |
| _(absent)_ | — | Normal user |

---

### `GET /listings`

Search and filter properties with pagination.

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `suburb` | string | Filter by suburb (case-insensitive) |
| `price_min` | number | Minimum price |
| `price_max` | number | Maximum price |
| `beds` | number | Minimum number of bedrooms |
| `baths` | number | Minimum number of bathrooms |
| `type` | string | Property type: `house`, `apartment`, `townhouse` |
| `keyword` | string | Search in title, description, suburb |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10, max: 50) |

**Example requests:**

```bash
# All listings
curl http://localhost:5000/listings

# Filter by suburb and price range
curl "http://localhost:5000/listings?suburb=Northside&price_min=500000&price_max=1000000"

# Filter by type and beds
curl "http://localhost:5000/listings?type=apartment&beds=2"

# Keyword search with pagination
curl "http://localhost:5000/listings?keyword=modern&page=1&limit=5"

# Admin request (sees internalStatusNotes)
curl http://localhost:5000/listings -H "x-admin: true"
```

**Example response:**

```json
{
  "data": [
    {
      "id": 7,
      "title": "Riverside Studio Apartment",
      "description": "Compact and stylish studio...",
      "suburb": "Riverside",
      "propertyType": "apartment",
      "price": 280000,
      "beds": 1,
      "baths": 1,
      "agent": {
        "id": 3,
        "name": "Emily Chen",
        "email": "emily@realestate.com",
        "phone": "0434 567 890"
      }
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

### `GET /listings/:id`

Fetch a single property by ID.

```bash

curl http://localhost:5000/listings/1


curl http://localhost:5000/listings/1 -H "x-admin: true"
```

**Example response (admin):**

```json
{
  "id": 1,
  "title": "Modern Family Home in Northside",
  "description": "Spacious modern home...",
  "suburb": "Northside",
  "propertyType": "house",
  "price": 850000,
  "beds": 4,
  "baths": 2,
  "internalStatusNotes": "Vendor motivated to sell quickly. Will accept offers above $820k.",
  "agent": {
    "id": 1,
    "name": "Sarah Johnson",
    "email": "sarah@realestate.com",
    "phone": "0412 345 678"
  }
}
```

**Error responses:**

| Status | Meaning |
|---|---|
| `400` | Invalid ID (non-numeric) |
| `404` | Property not found |
| `500` | Internal server error |

---

### `GET /health`

```bash
curl http://localhost:5000/health
# { "status": "ok", "db": "connected" }
```

---

## Project Structure

```
tech-kraft-task/
├── backend/
│   ├── src/
│   │   ├── config/         # TypeORM DataSource
│   │   ├── controllers/    # Request handlers
│   │   ├── entities/       # TypeORM entities (Property, Agent)
│   │   ├── middleware/      # Auth middleware
│   │   ├── migrations/     # DB migrations
│   │   ├── routes/         # Express routers
│   │   ├── seed/           # DB seeder
│   │   ├── services/       # Business logic
│   │   └── tests/          # Jest + Supertest integration tests
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Next.js app
├── docker-compose.yaml
└── Readme.md
```

---

## Schema Overview

### `agent`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `name` | varchar | |
| `email` | varchar | unique |
| `phone` | varchar | nullable |
| `is_admin` | boolean | default false |

### `property`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `title` | varchar | |
| `description` | varchar | nullable |
| `suburb` | varchar | indexed |
| `propertyType` | varchar | indexed |
| `price` | integer | indexed |
| `beds` | integer | |
| `baths` | integer | |
| `internalStatusNotes` | varchar | admin-only field |
| `agentId` | FK → agent | |

# Test

   ASS  src/tests/listings.test.ts
  GET /listings
    ✓ should return paginated results with meta (67 ms)
    ✓ should filter by suburb (case-insensitive) (15 ms)
    ✓ should filter by price range (15 ms)
    ✓ should filter by property type (13 ms)
    ✓ should respect pagination params (22 ms)
  Role-based access: internalStatusNotes
    ✓ should NOT expose internalStatusNotes to non-admin users (18 ms)
    ✓ should expose internalStatusNotes to admin users (22 ms)
  GET /listings/:id
    ✓ should return a single property by id (7 ms)
    ✓ should return 404 for a non-existent property (12 ms)
    ✓ should return 400 for an invalid id (6 ms)
    ✓ should hide internalStatusNotes for non-admin on detail page (8 ms)
    ✓ should show internalStatusNotes for admin on detail page (8 ms)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        3.429 s