# Real Estate Listing Platform

A full-stack real estate listing platform with a filterable, paginated property browser. Built with a Next.js frontend and a Node.js + Express REST API backend backed by PostgreSQL.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start — Pull Images (No Build Required)](#quick-start--pull-images-no-build-required)
- [Quick Start — Build from Source](#quick-start--build-from-source)
- [Frontend](#frontend)
  - [Pages & Components](#pages--components)
  - [Filtering & Pagination](#filtering--pagination)
  - [Environment Variables](#environment-variables-frontend)
- [Backend](#backend)
  - [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Migrations & Seeding](#migrations--seeding)
  - [Running Tests](#running-tests)
- [Database Schema](#database-schema)
- [Docker Images](#docker-images)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React, Tailwind CSS, TypeScript |
| **Backend** | Node.js, Express 5, TypeScript, TypeORM |
| **Database** | PostgreSQL 15 |
| **Containerisation** | Docker + Docker Compose |

---

## Project Structure

```
tech-kraft-task/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (Geist font, metadata)
│   │   ├── page.tsx                # Redirects / → /listings
│   │   └── listings/
│   │       ├── page.tsx            # Listings page (passes searchParams)
│   │       └── [id]/
│   │           └── page.tsx        # Individual listing detail page
│   ├── components/
│   │   ├── ListingsView.tsx        # Server component — fetches & renders listing grid
│   │   ├── ListingCard.tsx         # Single property card
│   │   ├── Filter.tsx              # Client filter bar (min price, beds)
│   │   └── Pagination.tsx          # Prev/Next pagination controls
│   ├── types/
│   │   └── listing.ts              # TypeScript interfaces (Listing, Agent)
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/                 # TypeORM DataSource
│   │   ├── controllers/            # Request handlers
│   │   ├── entities/               # TypeORM entities (Property, Agent)
│   │   ├── middleware/             # Auth middleware (x-admin header)
│   │   ├── migrations/             # DB migrations
│   │   ├── routes/                 # Express routers
│   │   ├── seed/                   # DB seeder (4 agents, 12 properties)
│   │   ├── services/               # Business logic
│   │   └── tests/                  # Jest + Supertest integration tests
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yaml             # Build from source
├── docker-compose.prebuilt.yaml    # Run using pre-built Docker Hub images
└── Readme.md
```

---

## Quick Start — Pull Images (No Build Required)

This is the fastest way to run the project. Docker pulls the pre-built images from Docker Hub — no cloning or building needed.

### 1. Create the backend `.env` file

Create a folder called `backend/` and add a `.env` file inside it:

```env
PORT=5000
DB_HOST=db
DB_PORT=5432
DB_USER=suman
DB_PASSWORD=postgres
DB_NAME=realestate
```

### 2. Pull the images

```bash
docker pull sumail829/realestate-frontend
docker pull sumail829/realestate-backend
```

### 3. Create `docker-compose.prebuilt.yaml`

Save the file below (also included in the repo as `docker-compose.prebuilt.yaml`):

```yaml
services:
  frontend:
    image: sumail829/realestate-frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend

  backend:
    image: sumail829/realestate-backend
    restart: always
    ports:
      - "5000:5000"
    env_file:
      - backend/.env
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: suman
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: realestate
    ports:
      - "5435:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U suman -d realestate"]
      interval: 5s
      timeout: 5s
      retries: 5
```

### 4. Start all services

```bash
docker compose -f docker-compose.prebuilt.yaml up -d
```

### 5. Run migrations and seed

```bash
docker compose -f docker-compose.prebuilt.yaml exec backend npm run migration:run
docker compose -f docker-compose.prebuilt.yaml exec backend npm run seed
```

### 6. Open the app

| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:5000 |

---

## Quick Start — Build from Source

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed

### 1. Clone the repo

```bash
git clone https://github.com/sumail829/tech-kraft-task.git
cd tech-kraft-task
```

### 2. Create the backend `.env` file

```env
# backend/.env
PORT=5000
DB_HOST=db
DB_PORT=5432
DB_USER=suman
DB_PASSWORD=postgres
DB_NAME=realestate
```

### 3. Build and start

```bash
docker compose up --build
```

### 4. Run migrations

```bash
docker compose exec backend npm run migration:run
```

### 5. Seed the database

```bash
docker compose exec backend npm run seed
```

This inserts **4 agents** and **12 properties** across suburbs and property types.

### 6. Open the app

| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:5000 |

---

## Frontend

The frontend is a **Next.js 14** app using the App Router. It connects to the backend REST API to display, filter, and paginate real estate listings.

### Architecture

```
Browser
  │
  ├── GET /listings?price_min=X&beds=Y&page=Z
  │         │
  │    app/listings/page.tsx   (passes searchParams down)
  │         │
  │    components/ListingsView.tsx   (Server Component — fetches API)
  │         │
  │         ├── components/Filter.tsx       (Client — updates URL params)
  │         ├── components/ListingCard.tsx  (renders each listing)
  │         └── components/Pagination.tsx  (Client — prev/next navigation)
  │
  └── GET /listings/:id
            │
       app/listings/[id]/page.tsx   (fetches single listing from API)
```

### Pages & Components

#### Listings Page — `app/listings/page.tsx`

The main listing browser. URL search params (`price_min`, `beds`, `page`, etc.) are forwarded to `ListingsView` for server-side fetching.

```
http://localhost:3000/listings
http://localhost:3000/listings?price_min=500000&beds=3&page=2
```

#### Detail Page — `app/listings/[id]/page.tsx`

Fetches and displays a single property by ID directly from the API.

```
http://localhost:3000/listings/1
```

#### `ListingsView` — Server Component

Fetches listings from the API server-side using the current URL params. Composes the filter bar, listing cards, and pagination.

#### `ListingCard` — Property Card

Displays one listing with:
- Title, suburb, price
- Beds, baths, property type badge
- Agent name and phone number

#### `Filter` — Client Filter Bar

A client-side component that lets users filter by:

| Field | Description |
|---|---|
| **Min Price** | Minimum listing price (number input) |
| **Beds** | Minimum number of bedrooms (number input) |

Clicking **Apply** updates the URL params and resets to page 1, triggering a server-side re-fetch.

#### `Pagination` — Prev/Next Controls

Updates the `page` query param in the URL while preserving all active filters.

---

### Filtering & Pagination

All filtering and pagination state lives in the **URL**. This means:

- Pages are fully **bookmarkable and shareable** with filters applied
- Refreshing the page preserves your current filters and page
- The server fetches the correct data on every navigation — no client-side state management needed

Example filtered URL:

```
http://localhost:3000/listings?price_min=400000&beds=2&page=2
```

---

### Environment Variables (Frontend)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Backend API base URL |

When using Docker Compose, set this in the `environment` block of the frontend service (already included in `docker-compose.prebuilt.yaml`).

---

## Backend

### API Reference

#### Base URL

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
# Normal user
curl http://localhost:5000/listings/1

# Admin user
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

### Migrations & Seeding

```bash
# Run DB migrations
docker compose exec backend npm run migration:run

# Seed with sample data (4 agents, 12 properties)
docker compose exec backend npm run seed
```

---

### Running Tests

Tests use **Jest + Supertest** and connect to the real database. Make sure the DB is running and seeded first.

```bash
docker compose exec backend npm test
```

**Test coverage:**

```
GET /listings
  ✓ should return paginated results with meta
  ✓ should filter by suburb (case-insensitive)
  ✓ should filter by price range
  ✓ should filter by property type
  ✓ should respect pagination params
Role-based access: internalStatusNotes
  ✓ should NOT expose internalStatusNotes to non-admin users
  ✓ should expose internalStatusNotes to admin users
GET /listings/:id
  ✓ should return a single property by id
  ✓ should return 404 for a non-existent property
  ✓ should return 400 for an invalid id
  ✓ should hide internalStatusNotes for non-admin on detail page
  ✓ should show internalStatusNotes for admin on detail page

Tests: 12 passed
```

---

## Database Schema

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

---

## Docker Images

Pre-built images are published on Docker Hub:

| Image | Docker Hub |
|---|---|
| Frontend | [`sumail829/realestate-frontend`](https://hub.docker.com/r/sumail829/realestate-frontend) |
| Backend | [`sumail829/realestate-backend`](https://hub.docker.com/r/sumail829/realestate-backend) |

```bash
docker pull sumail829/realestate-frontend
docker pull sumail829/realestate-backend
```

Use `docker-compose.prebuilt.yaml` to run the full stack from pulled images — no source code or build step required.
