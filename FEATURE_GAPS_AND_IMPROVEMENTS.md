# Smart Living System — Feature Gaps & Improvement Backlog

**Purpose:** This document summarizes a review of the project proposal (`docs/project_proposal.txt`), the documented structure (`PROJECT_STRUCTURE.md`), and the **current codebase** (April 2026). It lists **missing capabilities**, **improvements**, and a short **market positioning** note for a Bangladesh-focused product.

**Related:** `MISSING_FEATURES.md` contains a longer module-by-module checklist; parts of it predate recent UI work and should be reconciled with this file.

---

## 1. Market positioning (Bangladesh)

**Is a single app that combines discovery, booking, apartment/mess management, billing, and owner–tenant tools “unavailable” in Bangladesh?**

- **Broadly, your differentiation story is reasonable.** Major listing players (e.g. property portals) focus on **discovery and leads**, not **ongoing rent, bills, notices, and mess/seat operations**. Mess/hostel and small-hotel workflows are still largely **Facebook groups, phone, and cash**.
- **Caveats:** The market moves quickly; niche apps, agent tools, and international booking/travel apps overlap pieces of your scope. Success will depend on **trust, liquidity of listings, payments**, and **operator adoption**, not only feature breadth.

Use this positioning as a **hypothesis to validate with users**, not as a guarantee of blue-ocean status.

---

## 2. Documentation vs actual codebase

| Topic | `PROJECT_STRUCTURE.md` / older notes | Current repo (observed) |
|--------|----------------------------------------|-------------------------|
| Router | Describes **Pages Router** (`pages/`) | Uses **App Router** under `app/` |
| Scope | Small set of pages | **Many routes**: search, hotels, mess, owner buildings/floors/flats, admin, dashboards, messages, payments, etc. |
| Data | “API-ready” | **`utils/api.ts` exists** but screens overwhelmingly use **`@/data/mock*.ts`** (in-memory mocks) |
| Auth | — | **Simulated** (e.g. OTP flow; session flags in `sessionStorage`) — not production identity |

**Action:** Update `PROJECT_STRUCTURE.md` to reflect `app/`, real folders (`components/`, `data/`, `types/`), and note that the app is **frontend-first with mock persistence**.

---

## 3. Current implementation snapshot (strengths)

These are **present in the UI/types/components** at a product-design level (often backed by mocks):

- **Discovery & filters:** `app/search/page.tsx` — city/area, property types including hostel/hotel, rent range, gender/seat/meal, advanced filters, list/map toggle, `PropertyMap` (Google Maps loader + API key).
- **Hotels:** `app/hotels/`, `app/hotels/[hotelId]/`, booking flow, owner `app/my-hotels/` routes — components such as `HotelCard`, `BookingCalendar`, `BookingForm`.
- **Mess / student views:** Mess dashboards, meals, attendance, rules, SMS UI, expenses — under `app/mess/`.
- **Apartment owner structure:** Buildings → floors → flats, stats — under `app/my-properties/...`.
- **Renter/owner dashboards:** `app/dashboard/page.tsx` with role-specific dashboard components.
- **Admin shell:** `app/admin/` (users, properties, complaints, verifications, disputes, analytics, settings, audit-logs) with `AdminLayout`.
- **Supporting UX:** Favorites, saved searches, search history, messages UI, complaints, bills, expenses, reports, reminders, profile/documents, notifications.

**Critical gap:** Almost all of the above **does not persist** or **sync across devices** without a real backend and auth.

---

## 4. Missing features (by priority)

### 4.1 Critical — production readiness

| Area | Gap |
|------|-----|
| **Backend API** | No durable server layer in-repo tying entities (users, listings, bookings, bills, chats) to a database. |
| **Authentication & authorization** | Real OTP/SMS, JWT/session, passwordless or secure account recovery, server-side role checks (not only client `sessionStorage`). |
| **Persistence** | Replace in-memory mocks with API + DB; optimistic UI and error handling. |
| **Payments (Bangladesh)** | bKash / Nagad / Rocket (and later cards): initiation, webhooks, reconciliation, refunds, dispute hooks — per proposal Module 6. |
| **File storage** | NID/agreements/notices/images/video — S3-compatible or similar; virus scan and size limits. |
| **Notifications** | SMS (BD gateways), email, and push — with user preferences and audit trail. |

### 4.2 High — trust & operations (proposal Modules 1, 7)

| Area | Gap |
|------|-----|
| **Verification** | End-to-end NID/phone/listing verification workflows, moderator tools (UI exists; needs real process + compliance). |
| **Booking truth** | Conflict prevention, cancellation rules, deposits, owner acceptance queues — beyond mock `mockBookings`. |
| **Chat** | Real-time transport, delivery receipts, moderation, attachment policy — `messages` is mock-driven. |
| **Duplicate / stale listings** | Moderation, reporting, freshness rules. |
| **Legal & policy** | Terms, privacy (data residency expectations), rental agreement templates (BD context). |

### 4.3 High — product completeness vs proposal

| Module (proposal) | Remaining gaps (even where UI exists) |
|-------------------|----------------------------------------|
| **1 — Discovery** | Live listing pipeline; owner onboarding; SEO for public listings; anti-scam education. |
| **2 — Apartment management** | Automated billing rules, meter-based utilities, audit logs **persisted**, police verification docs **securely stored**. |
| **3 — Renter app** | Bank-grade payment history from gateway; downloadable receipts; move-in/out checklists tied to **signed** state. |
| **4 — Mess/hostel** | Attendance and bulk SMS **connected** to real providers; seat inventory as source of truth. |
| **5 — Hotel** | Channel manager-style calendar, OTA parity, taxes/fees, invoice generation. |
| **6 — Payments** | Cash recording for offline users, owner payouts, commission engine, reporting. |
| **7 — Admin** | Fraud signals, dispute resolution SLAs, analytics fed by real events. |

### 4.4 Medium — monetization (proposal Section 4)

- Subscription tiers (free vs paid flats/buildings), featured listings, booking commission — **not implemented** as billable systems.
- SaaS / white-label — future; depends on multi-tenant backend.

### 4.5 Medium — quality & scale

- **Performance:** SSR/ISR for public listing pages, image optimization pipeline, map marker clustering at scale.
- **Accessibility:** WCAG-oriented passes on forms and dashboards.
- **i18n:** Bengali/English toggles exist in places; **full copy coverage** and RTL/date/number formats where needed.
- **Mobile app:** Proposal suggests **Flutter** — not present; responsive web is the current vehicle.

### 4.6 Lower priority / later phases (proposal)

- AI recommendations, fraud ML, demand heatmaps, corporate housing, multi-city ops playbooks.

---

## 5. Improvements needed (cross-cutting)

### 5.1 Product & UX

- **Unify discovery:** `app/properties/page.tsx` is still **placeholder cards**; align with `app/search` or redirect to avoid a confusing dual experience.
- **Empty states & onboarding:** First-time owner/mess/hotel setup wizards.
- **Offline-first expectations:** Clear messaging where network is required (payments, chat).
- **Consistency:** Single pattern for “request vs instant book” across mess, apartment, and hotel.

### 5.2 Engineering

- **API contract:** OpenAPI or typed client from backend; replace direct mock imports in pages with a **data layer** (e.g. `services/` + React Query/SWR).
- **Testing:** E2E for auth, search, booking; unit tests for billing calculations.
- **Security:** CSP, rate limiting on auth, PII encryption at rest, admin audit logs immutable.
- **Observability:** Structured logging, error tracking, product analytics (funnel from search → booking → payment).

### 5.3 DevOps

- CI (lint, test, build), staged environments, secrets management for maps and payment keys.

---

## 6. Suggested roadmap (aligned with proposal phases)

1. **MVP backend + auth + listings + search API** — migrate off mocks for core flows.  
2. **Payments + notifications** — Bangladesh gateways and SMS.  
3. **Booking + chat + admin moderation** — operational trust loop.  
4. **Subscriptions + featured listings** — revenue experiments.  
5. **Mobile app** — once web metrics justify native investment.

---

## 7. Summary table

| Layer | Status |
|--------|--------|
| **UI / flows** | Broad coverage; many modules have screens and components. |
| **Data & auth** | Largely **mock/local**; not production-ready. |
| **Integrations** | Maps partially wired (needs valid keys & policies); **payments/SMS/email** not production-complete. |
| **Business model** | **Not implemented** end-to-end. |
| **Docs** | `PROJECT_STRUCTURE.md` **out of date** vs `app/` structure. |

---

*Last updated: April 2026. Regenerate or merge sections into `MISSING_FEATURES.md` when major modules ship.*
