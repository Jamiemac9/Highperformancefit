# JayMacFitness

Full-stack web app for personal trainer Jay Mac: bold dark/lime marketing site at `/` plus a trainer CRM at `/dashboard/*`.

## Stack
- **Frontend**: React + Vite + React Router v6, Tailwind, @tanstack/react-query, plain `fetch` via `src/lib/api.ts`
- **Backend**: Express + Prisma + PostgreSQL, JWT (httpOnly cookies)
- **Email**: nodemailer (jsonTransport in dev)
- **Theme**: dark `#0A0A0A` background, electric lime `#C8FF00` accent, fonts Bebas Neue (display) + DM Sans (body)
- **Mobile-first** layout throughout

## Routes
### Public (marketing Layout)
- `/` — landing (9 sections; submits to `/api/enquiries`)
- `/login`, `/register`

### Client portal (`PortalLayout`, sidebar desktop / bottom nav mobile, CLIENT role)
- `/portal` → redirects to `/portal/dashboard`
- `/portal/dashboard` — welcome, sessions-remaining hero, active packages, upcoming sessions, latest progress note from trainer
- `/portal/sessions` — full sessions history; status filter tabs (All / Upcoming / Completed / Cancelled); table desktop + cards mobile
- `/portal/book` — week-grid availability (prev/next week); confirm modal; blocks if 0 sessions remaining
- `/portal/packages` — 3-card layout, middle card highlighted; Stripe placeholder banner; confirm modal
- `/portal/profile` — edit personal details, training goal, emergency contact; email field locked

### Trainer dashboard (`DashboardLayout`, sidebar desktop / bottom nav mobile)
- `/dashboard` — summary home (stats, upcoming sessions, recent leads, client breakdown)
- `/dashboard/leads` — enquiries CRM (stats, filter tabs, expandable table + mobile cards, Mark Contacted / Convert / Mark Lost actions, pagination)
- `/dashboard/clients`, `/dashboard/clients/:id`
- `/dashboard/sessions`, `/dashboard/packages`, `/dashboard/bookings`, `/dashboard/settings`

Legacy `/clients`, `/clients/:id`, `/sessions`, `/packages`, `/bookings`, `/leads` redirect into `/dashboard/*` (preserving `:id`).

## Key API endpoints
- `POST /api/enquiries` — public, rate-limited 5/hr/IP, express-validator
- `GET  /api/enquiries?status=&page=&limit=` — trainer
- `GET  /api/enquiries/stats` — trainer; aggregated `{ total, counts{NEW,CONTACTED,CONVERTED,LOST}, conversionRate }` (used by dashboard so KPIs are accurate at any scale)
- `PATCH /api/enquiries/:id` — `{status?, note?}`
- `POST /api/enquiries/:id/convert` — transactional User+ClientProfile creation, sends welcome email; returns deterministic 409 on email conflict (incl. concurrent `P2002`)
- `DELETE /api/enquiries/:id`
- Legacy `/api/leads` — entire router is now trainer-only (public POST removed; use `/api/enquiries` instead)

### Client portal API
- `GET  /api/me/summary` — clients only; returns `{ profile, sessionsRemaining, activeBookings[], upcoming[] }`
- `GET  /api/me/profile`, `PATCH /api/me/profile` — clients only; safe field allow-list
- `GET  /api/slots?from=&to=` — auth required; clients are forced to the unbooked-only view (the `includeBooked=true` flag is honoured for trainers only)
- `POST /api/slots`, `POST /api/slots/bulk`, `DELETE /api/slots/:id` — trainer only
- `POST /api/bookings/purchase { packageId }` — clients only; Stripe placeholder. Without `STRIPE_SECRET_KEY` the route returns 503 in production and only succeeds (with a warning) in dev. Replace with a webhook-verified flow before handling real money.
- `POST /api/bookings/session { slotId }` — clients only; runs entirely inside one Prisma transaction. Slot is locked via conditional `updateMany({ id, isBooked:false })` and credits are decremented FIFO by re-querying the oldest active booking inside the tx (loops up to 5 attempts so concurrent requests fall through to the next eligible booking instead of falsely 409-ing).

## Models (Prisma)
`User`, `ClientProfile` (+ `emergencyContact`, `progressNote`), `Session` (+ `cancelled`), `Package`, `Booking`, `LeadEnquiry` (note, convertedClientId, source default `"website"`, updatedAt), `TrainerAvailability` (date, duration, type, isBooked, sessionId unique).

## Required env
`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`, `API_PORT` (default 5050). JWT secrets are required at startup — no defaults.

## Workflows
- `artifacts/jaymacfitness: web` — Vite dev
- `artifacts/jaymacfitness: api` — `tsx watch server/index.ts`

## Demo seed
Trainer login `trainer@example.com` / `Admin1234!`. Packages: 5 sessions £175, 10 sessions £300.
