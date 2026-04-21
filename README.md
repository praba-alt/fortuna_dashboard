# Fortuna Dashboard

Internal dashboard for Fortuna token/pool analytics, backed directly by Postgres.

## What It Includes

- Dashboard view with:
  - Strong / Medium / Risky counts
  - Sale status counts (Live, Upcoming, Completed, Cancelled)
  - Clickable donut legends (toggle segments on/off)
  - Chain-wise distribution
  - Average category scores
- Listing view with:
  - Server-side filters, pagination, and sorting
  - Category + total score columns
  - Right-side details dock (overlay)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- `pg` (direct SQL access)

## Environment

Create `.env`:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DB_NAME
```

Optional:

```bash
DIRECT_URL=postgres://USER:PASSWORD@HOST:5432/DB_NAME
NEXT_PUBLIC_CDN_BASE_URL=https://your-cdn.example.com
```

## Run Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm start
```

## API Routes

- `GET /api/dashboard-stats`
  - Aggregated stats for dashboard cards/charts
- `GET /api/token-list`
  - Listing data with filters/sort/pagination
- `GET /api/token/[address]`
  - Single pool detail payload for dock

## Listing Query Params (`/api/token-list`)

- `search`
- `chain`
- `saleType`
- `status`
- `score` (minimum trust score)
- `sortBy`
- `order` (`asc` / `desc`)
- `page`
- `pageSize`

## Status Semantics

Status logic is aligned with `fortuna-app`:

- `Live`: `state=0` and now within start/end window
- `Upcoming`: `state=3` OR (`state=0` and `start_date > now`)
- `Completed`: `state=1` OR (`state=0` and `end_date < now`)
- `Cancelled`: `state=2`

## Notes

- Dashboard uses DB aggregates (not listing page rows) for counts.
- Sorting in listing is server-side and header-driven.
- No token images are shown in listing table currently.
