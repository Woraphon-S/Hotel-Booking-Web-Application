# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Thai-language hotel/accommodation booking web app. Two independent npm projects plus a Postgres database:

- `server/` — NestJS 11 REST API (port 3001)
- `client/` — Next.js 16 / React 19 App Router frontend (port 3000)
- `docker-compose.yml` — Postgres 15 (db), plus optional containerized server/client

There is **no root `package.json`**; run npm commands inside `server/` or `client/`.

## Running locally

Requires Node.js and Docker. Connection settings are already in `server/.env` and `client/.env` — no changes needed.

```bash
docker compose up -d db          # Postgres on host port 5433 -> container 5432
cd server && npm install && npm run start:dev   # API on :3001 (watch mode)
cd client && npm install && npm run dev         # Web on :3000
```

The schema is **applied automatically on server boot** (see Database below) — no migration step. Optional seed data:

```bash
docker exec -i hotel_booking_db psql -U postgres -d hotel_booking < server/scratch/mock_data.sql
```

Full stack in containers: `docker compose up --build`.

## Commands

Server (`cd server`):
- `npm run start:dev` — run with watch
- `npm run build` / `npm run start:prod` — compile to `dist/` and run
- `npm run lint` — ESLint with `--fix`
- `npm run format` — Prettier
- `npm test` — Jest (unit, `*.spec.ts`)
- `npm test -- <pattern>` or `npx jest path/to/file.spec.ts` — run a single test/file
- `npm run test:e2e` — Jest against `test/jest-e2e.json`

Client (`cd client`):
- `npm run dev` / `npm run build` / `npm start`
- `npm run lint`
- No test runner is configured for the client.

## Server architecture (NestJS, raw SQL)

**No ORM.** Persistence is hand-written SQL through the `pg` driver.

- `DatabaseService` (`src/database/`) is a `@Global()` provider wrapping a `pg.Pool`. Use it for all DB access:
  - `query(text, params)` — one-off queries
  - `transaction(async (client) => …)` — runs `BEGIN`/`COMMIT`/`ROLLBACK` around the callback; pass the `client` down to repository methods that must share the transaction
  - On boot, `onModuleInit()` executes `src/database/scripts/init.sql`. That script is idempotent (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE … ADD COLUMN IF NOT EXISTS`). **Schema changes go here**, not into a migration tool — keep them idempotent so re-running on an existing DB is safe.

- Each feature module follows **controller → service → repository** layering: the controller handles HTTP + guards, the service holds business rules, the repository holds SQL. Repository methods that participate in a transaction take a `PoolClient` as their first argument. Feature modules: `users`, `auth`, `properties`, `rooms`, `bookings`, `payments`, `reviews`, `uploads`.

- **Auth** (`src/auth/`): JWT access + refresh tokens (`@nestjs/jwt` + Passport `JwtStrategy`), bcrypt password hashing. Protect routes with `JwtAuthGuard`; restrict by role with `RolesGuard` + `@Roles('owner'|'user'|'admin')`; read the authenticated user with the `@CurrentUser()` decorator. Roles enum: `user | owner | admin`.

- File uploads are served statically from `<cwd>/uploads` at the `/uploads` URL prefix (`src/main.ts`). CORS is locked to `http://localhost:3000`.

### Invariants to preserve

These back-end rules are the point of the app — don't regress them:

- **No double booking.** `BookingsService.createBooking` opens a transaction, takes a row lock (`SELECT … FROM rooms WHERE id = $1 FOR UPDATE`) to serialize concurrent requests for the same room, then checks availability via `total_rooms - COUNT(active bookings that OVERLAP the dates)` before inserting. Availability/insert must stay inside that locked transaction.
- **Server computes price.** Total = `nights * room.price_per_night`, calculated server-side; never trust a price sent by the client.
- **Ownership scoping.** Users only see/modify their own data; owners only manage their own properties (e.g. `getBookingForUser` rejects mismatched `user_id`). New endpoints must enforce the same scoping.
- Reviews are only allowed from users with a confirmed booking for that property.

## Client architecture (Next.js App Router)

> ⚠️ See `client/AGENTS.md`: this is a bleeding-edge Next.js (v16) / React 19 setup whose APIs may differ from training data. Read the relevant guide under `client/node_modules/next/dist/docs/` before writing client code.

- **Feature-based layout.** Routes live in `src/app/` (App Router, including route groups like `(auth)`). Domain code lives in `src/features/<feature>/{components,services,types}`. Shared building blocks: `src/components/ui`, `src/components/layout`, `src/stores`, `src/hooks`, `src/lib`.

- **API access goes through one axios instance**, `src/services/apiClient.ts`:
  - request interceptor injects `Authorization: Bearer <accessToken>` from the auth store
  - response interceptor catches `401`, calls `/auth/refresh` once, updates the token, and retries the original request; on failure it clears auth
  - Feature `*.service.ts` files call this client — add new API calls there, not with ad-hoc axios.

- **State: Zustand with `persist`.** `authStore` (persisted to `localStorage` key `auth-storage`), `favoriteStore`, `languageStore`. Server state uses `@tanstack/react-query` (wired in `src/components/layout/Providers.tsx`).

- **i18n is custom:** `languageStore` + `useTranslation` hook toggle Thai/English. Maps use `leaflet` / `react-leaflet`.

## Database

PostgreSQL 15. Host port **5433** maps to container 5432 (so `server/.env` uses `DATABASE_PORT=5433` for local dev). Enums: `user_role`, `booking_status` (`pending|confirmed|cancelled|completed`), `payment_status`. `updated_at` columns are maintained by a shared `update_updated_at_column()` trigger applied in `init.sql`.
