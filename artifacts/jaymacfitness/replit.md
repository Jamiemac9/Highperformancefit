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
- `/portal` — client portal (CLIENT role)

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

## Models (Prisma)
`User`, `ClientProfile`, `Session`, `Package`, `Booking`, `LeadEnquiry` (note, convertedClientId, source default `"website"`, updatedAt).

## Required env
`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`, `API_PORT` (default 5050). JWT secrets are required at startup — no defaults.

## Workflows
- `artifacts/jaymacfitness: web` — Vite dev
- `artifacts/jaymacfitness: api` — `tsx watch server/index.ts`

## Demo seed
Trainer login `trainer@example.com` / `Admin1234!`. Packages: 5 sessions £175, 10 sessions £300.
