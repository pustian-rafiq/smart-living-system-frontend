# Smart Living Ecosystem — Backend Design (Django + DRF)

**Version:** 1.0  
**Date:** July 2026  
**Status:** Design specification — build backend step-by-step from this document  
**Frontend reference:** Next.js 15 app in `smart-living-system/` with `lib/api/*` mock layer  
**Original proposal:** `docs/project_proposal.txt`

---

## Table of contents

1. [Purpose & scope](#1-purpose--scope)
2. [Frontend alignment summary](#2-frontend-alignment-summary)
3. [Architecture overview](#3-architecture-overview)
4. [Technology stack](#4-technology-stack)
5. [Django project structure](#5-django-project-structure)
6. [Cross-cutting conventions](#6-cross-cutting-conventions)
7. [Authentication & authorization](#7-authentication--authorization)
8. [Domain model (data design)](#8-domain-model-data-design)
9. [API surface — complete endpoint map](#9-api-surface--complete-endpoint-map)
10. [Module requirements (detailed)](#10-module-requirements-detailed)
11. [Payments & Bangladesh gateways](#11-payments--bangladesh-gateways)
12. [Files, media & documents](#12-files-media--documents)
13. [Background jobs & notifications](#13-background-jobs--notifications)
14. [Real-time (phase 2)](#14-real-time-phase-2)
15. [Admin & operations](#15-admin--operations)
16. [Security & compliance](#16-security--compliance)
17. [Observability & audit](#17-observability--audit)
18. [Frontend integration contract](#18-frontend-integration-contract)
19. [Implementation phases](#19-implementation-phases)
20. [Future extensibility](#20-future-extensibility)
21. [Appendix A — Entity relationship overview](#appendix-a--entity-relationship-overview)
22. [Appendix B — Environment variables](#appendix-b--environment-variables)

---

## 1. Purpose & scope

This document defines the **complete backend** for the Smart Living Ecosystem (Bangladesh): mess, hostel, hotel, and apartment management with discovery, booking, billing, payments, and admin trust systems.

### Goals

| Goal                | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| **Frontend parity** | Every `lib/api/*.ts` function maps to a real HTTP endpoint    |
| **Mechanical swap** | Replace mock implementations in `lib/api/` without UI changes |
| **Future-proof**    | Modular Django apps, versioned API, extensible permissions    |
| **BD-ready**        | Phone OTP, bKash/Nagad/Rocket, ৳, SMS gateway hooks           |

### In scope (v1 backend)

- REST API (`/api/v1/`) consumed by Next.js web app
- PostgreSQL persistence, Redis cache/queues, object storage for uploads
- JWT auth + role-based access (renter / owner / admin)
- All modules reflected in frontend: discovery, portfolio, bills, payments, mess, hotels, admin, monetization

### Out of scope (later phases)

- Flutter mobile app (separate client, same API)
- AI recommendations, demand heatmaps ML
- White-label / multi-tenant SaaS branding
- Service worker / offline sync

---

## 2. Frontend alignment summary

### What the frontend already defines

| Artifact          | Location                           | Backend use                    |
| ----------------- | ---------------------------------- | ------------------------------ |
| API functions     | `lib/api/*.ts` (28 modules)        | Endpoint + serializer targets  |
| Response shape    | `lib/api/http.ts` → `ApiResult<T>` | Envelope format                |
| Types             | `types/*.ts` (31 files)            | Serializer / OpenAPI schemas   |
| Contracts         | `lib/api/contracts.ts`             | Request/response documentation |
| Route guards      | `lib/auth/role-routes.ts`          | Permission matrix              |
| Admin permissions | `lib/admin/permissions.ts`         | Admin RBAC                     |
| Pages             | 74 routes in `app/`                | User journeys to support       |

### Frontend roles → backend principals

| Frontend role | Backend                                           | Notes                             |
| ------------- | ------------------------------------------------- | --------------------------------- |
| `renter`      | `User` + `role=RENTER`                            | Tenant, student, guest booker     |
| `owner`       | `User` + `role=OWNER`                             | Building/mess/hotel/listing owner |
| `admin`       | `User` + `role=ADMIN` + `AdminProfile.admin_role` | super-admin / moderator / support |

One phone number → one `User`. A person can hold **multiple hats** in future via `UserRoleAssignment`; v1 keeps single active role per session (matches frontend `sessionStorage.userRole`).

---

## 3. Architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Frontend (Web)                       │
│  app/*  components/*  →  lib/api/*  →  HTTP client (future)       │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS  /api/v1/*
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Django + Django REST Framework                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ accounts │ │ listings │ │ billing  │ │ payments │  ...      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│         Permissions · Serializers · Services · Signals           │
└─────┬──────────────┬──────────────┬──────────────┬──────────────┘
      │              │              │              │
      ▼              ▼              ▼              ▼
 PostgreSQL       Redis          Celery         S3 / MinIO
 (primary DB)   (cache/queue)   (async jobs)   (media/files)
      │
      ▼
 External: SMS OTP · bKash · Nagad · Rocket · SSLCommerz · Google Maps
```

### Design principles

1. **Bounded contexts** → one Django app per business area (not one model per file).
2. **Service layer** for complex flows (bill generation, payment webhooks, booking state machine).
3. **Thin views** — validate input, call service, return envelope.
4. **Idempotent webhooks** — payment callbacks safe to retry.
5. **Soft deletes** on user-facing entities where history matters (bills, bookings).
6. **Audit trail** on financial and moderation mutations.

---

## 4. Technology stack

| Layer          | Choice                                                                  | Rationale                                      |
| -------------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| Framework      | **Django LTS 5.x**                                                      | ORM, migrations, admin, auth ecosystem         |
| API            | **Django REST Framework 3.17.1+**                                       | ViewSets, permissions, pagination              |
| Auth           | **djangorestframework-simplejwt**                                       | Access + refresh tokens for SPA                |
| DB             | **PostgreSQL 15+**                                                      | Relational domain, JSON fields for metadata    |
| Cache / broker | **Redis 7**                                                             | Sessions, OTP, Celery broker, rate limits      |
| Task queue     | **Celery 5**                                                            | Bills schedule, reminders, SMS, webhooks retry |
| Storage        | **S3-compatible** (AWS S3 / DigitalOcean Spaces / MinIO)                | Images, PDFs, receipts                         |
| API docs       | **drf-spectacular**                                                     | OpenAPI 3 — sync with frontend types           |
| Filtering      | **django-filter**                                                       | Search/list endpoints                          |
| CORS           | **django-cors-headers**                                                 | Next.js origin                                 |
| Phone OTP      | **Custom + SMS provider** (e.g. SSL Wireless, Twilio, local BD gateway) | Login flow                                     |
| Payments       | **Adapter pattern** per gateway                                         | bKash, Nagad, Rocket, SSLCommerz               |

### Recommended repo layout (sibling to frontend)

```
smart-living-system/          # existing Next.js frontend
smart-living-api/             # new Django project (create in phase 0)
├── config/                   # settings, urls, wsgi, celery
├── apps/
│   ├── accounts/
│   ├── listings/
│   ├── portfolio/
│   ├── bookings/
│   ├── billing/
│   ├── payments/
│   ├── mess/
│   ├── hotels/
│   ├── messaging/
│   ├── support/
│   ├── documents/
│   ├── discovery/
│   ├── subscriptions/
│   ├── reports/
│   ├── audit/
│   └── admin_api/
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
└── manage.py
```

---

## 5. Django project structure

### App responsibilities

| Django app        | Domain            | Key models                                                                                           |
| ----------------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| **accounts**      | Identity          | `User`, `OTPChallenge`, `UserProfile`, `AdminProfile`, `VerificationDocument`                        |
| **listings**      | Discovery         | `Property`, `PropertyImage`, `PropertyReview`                                                        |
| **portfolio**     | Apartment ops     | `Building`, `Floor`, `Flat`, `Tenancy`, `RenterProfile`                                              |
| **bookings**      | Property bookings | `PropertyBooking`                                                                                    |
| **billing**       | Bills             | `Bill`, `BillItem`, `BillTemplate`, `BillGenerationRule`, `MeterReading`                             |
| **payments**      | Money             | `PaymentTransaction`, `ScheduledPayment`, `PaymentSchedule`, `OwnerPayout`, `PaymentWebhookEvent`    |
| **mess**          | Mess/hostel       | `Mess`, `Seat`, `Student`, `MessNotice`, `MealMenu`, `Attendance`, `SMS*`, `MessRule`, `MessExpense` |
| **hotels**        | Hotels            | `Hotel`, `Room`, `RoomPrice`, `HotelBooking`, `HotelReview`, `CancellationPolicy`                    |
| **messaging**     | Comms             | `Chat`, `ChatParticipant`, `ChatMessage`, `Notification`                                             |
| **support**       | Trust             | `Complaint`, `Dispute`                                                                               |
| **documents**     | Legal             | `RentalAgreement`, `AgreementRenewal`, `Checklist`, `ChecklistItem`                                  |
| **discovery**     | Search UX         | `SavedSearch`, `SearchHistory`, `Favorite`                                                           |
| **subscriptions** | Monetization      | `SubscriptionPlan`, `OwnerSubscription`, `FeaturedBoost`, `PlanUsage`                                |
| **reports**       | Renter tools      | `ExpenseCategory`, `ExpenseEntry`, `Budget`, `ExpenseReport`, `TaxDocument`, `Reminder`              |
| **audit**         | Compliance        | `AuditLog`                                                                                           |
| **admin_api**     | Admin aggregates  | Read models / services only (no duplicate business logic)                                            |

---

## 6. Cross-cutting conventions

### 6.1 API versioning

- Base path: **`/api/v1/`**
- Breaking changes → `/api/v2/` (frontend `lib/api/client.ts` switches version via env)

### 6.2 Response envelope (match frontend `ApiResult<T>`)

All JSON responses from the API **must** use this shape so `lib/api/http.ts` can parse uniformly:

**Success:**

```json
{
  "ok": true,
  "data": {}
}
```

**Error:**

```json
{
  "ok": false,
  "error": "Human-readable message",
  "code": "NOT_FOUND"
}
```

**Error codes** (align with `lib/api/http.ts`):

| Code              | HTTP status | Use                     |
| ----------------- | ----------- | ----------------------- |
| `NOT_FOUND`       | 404         | Entity missing          |
| `FORBIDDEN`       | 403         | Role/permission denied  |
| `INVALID`         | 400         | Validation failure      |
| `INVALID_ACCOUNT` | 400         | Wallet number invalid   |
| `GATEWAY_TODO`    | 501         | Gateway not configured  |
| `UNKNOWN`         | 500         | Unexpected server error |

Implement via custom DRF exception handler + `EnvelopeRenderer`.

### 6.3 Pagination

List endpoints return:

```json
{
  "ok": true,
  "data": {
    "results": [],
    "count": 120,
    "next": "https://api.../page=2",
    "previous": null
  }
}
```

Default page size: **20**. Max: **100**.

### 6.4 IDs & timestamps

- Primary keys: **UUID v4** (`uuid`) — matches frontend string ids
- Timestamps: `created_at`, `updated_at` (UTC, ISO 8601 in JSON)
- Money: **Decimal** in DB, serialized as **number** (BDT, 2 decimal places)

### 6.5 Common model mixins

```python
class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class Meta:
        abstract = True

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True
```

### 6.6 Ownership & query scoping

Every list/detail view **scopes by authenticated user**:

- Renter → own bills, bookings, complaints, messages
- Owner → own buildings, flats, mess, hotels, bills (owner view), payouts
- Admin → elevated via `admin_api` permissions

Never trust `userId` query params from client — derive from JWT.

---

## 7. Authentication & authorization

### 7.1 User model

```python
class User(AbstractBaseUser, UUIDModel, TimestampedModel):
    phone = models.CharField(max_length=20, unique=True)  # E.164 +880...
    email = models.EmailField(blank=True)
    name = models.CharField(max_length=255)
    role = models.CharField(choices=Role.choices)  # RENTER | OWNER | ADMIN
    is_active = models.BooleanField(default=True)
    is_phone_verified = models.BooleanField(default=False)
    profile_photo = models.ImageField(null=True, blank=True)
    locale = models.CharField(max_length=5, default='en')  # en | bn
```

### 7.2 OTP login flow (replaces demo sessionStorage)

| Step | Endpoint                           | Action                                                           |
| ---- | ---------------------------------- | ---------------------------------------------------------------- |
| 1    | `POST /api/v1/auth/otp/request/`   | Send OTP to `+8801XXXXXXXXX`                                     |
| 2    | `POST /api/v1/auth/otp/verify/`    | Verify code → return tokens + `user`                             |
| 3    | `POST /api/v1/auth/role/select/`   | Set `role` if user has multiple (v1: required after first login) |
| 4    | `POST /api/v1/auth/token/refresh/` | Refresh access token                                             |
| 5    | `POST /api/v1/auth/logout/`        | Blacklist refresh token                                          |

**Admin login:** same OTP flow; `AdminProfile` must exist with `admin_role`.

### 7.3 JWT payload claims

```json
{
  "sub": "<user_uuid>",
  "role": "owner",
  "admin_role": "moderator",
  "phone": "+8801712345678"
}
```

Access token TTL: **15 min**. Refresh: **7 days**.

### 7.4 Permission classes (DRF)

| Class                | Rule                                                 |
| -------------------- | ---------------------------------------------------- |
| `IsAuthenticated`    | Default for private routes                           |
| `IsRenter`           | Renter-only routes                                   |
| `IsOwner`            | Owner-only routes                                    |
| `IsAdmin`            | Admin area                                           |
| `HasAdminPermission` | Maps `lib/admin/permissions.ts` → Django permissions |

### 7.5 Object-level permissions

Use `django-guardian` or custom checks:

- Owner can edit only `Building.owner_id == request.user.id`
- Renter can pay only `Bill.tenant_id == request.user.tenant_profile.id`
- Admin actions gated by `AdminPermission` codenames

### 7.6 Account recovery (frontend `/account/*`)

| Endpoint                                     | Purpose                                           |
| -------------------------------------------- | ------------------------------------------------- |
| `POST /api/v1/account/phone-change/request/` | OTP to new phone                                  |
| `POST /api/v1/account/phone-change/confirm/` | Confirm change                                    |
| `POST /api/v1/account/recover/`              | Recover via OTP + security questions (v1 minimal) |

---

## 8. Domain model (data design)

### 8.1 Core identity & profiles

```
User 1──1 UserProfile (job, family JSON, emergency contacts)
User 1──1 AdminProfile (admin_role) [optional]
User 1──* VerificationDocument (NID, passport, police verification)
User 1──1 RenterProfile (via Tenancy link to Flat/Seat)
```

### 8.2 Discovery & listings

```
User (owner) 1──* Property
Property 1──* PropertyImage
Property 1──* PropertyReview
Property ── optional link ── Building | Mess (operational entity)
```

`Property` = marketing/discovery listing (`types/property.ts`).  
`Building`/`Mess` = operational portfolio (bills, tenants).

### 8.3 Apartment portfolio

```
Building 1──* Floor 1──* Flat
Flat 0..1── Tenancy ── Renter (User)
Tenancy stores: start_date, deposit, agreement_ref, status
```

### 8.4 Billing

```
Bill 1──* BillItem
BillTemplate 1──* BillTemplateItem
BillGenerationRule → cron triggers (Celery)
MeterReading → per property/flat/month
Bill ── FK ── tenant (User), property (Building|Mess), optional template
```

**Bill status:** `unpaid` | `paid` | `overdue` (computed via `due_date`)

### 8.5 Payments

```
PaymentTransaction ── FK Bill, User
ScheduledPayment ── FK Bill, User
OwnerPayout ── FK PaymentTransaction, Owner
PaymentWebhookEvent (gateway idempotency)
```

### 8.6 Mess

```
Mess 1──* Seat 1──0..1 Student (User)
Mess 1──* MessNotice
Mess 1──* MealMenu / WeeklySchedule
Mess 1──* AttendanceRecord
Mess 1──* SMSTemplate, SMSGroup, SMSMessage
Mess 1──* MessRule, RuleAcceptance, RuleViolation
Mess 1──* MessExpense
```

### 8.7 Hotels

```
Hotel 1──* Room 1──* RoomPrice (date-based)
Hotel 1──* HotelBooking
Hotel 1──* HotelReview
Hotel 1──1 CancellationPolicy (JSON or normalized)
```

### 8.8 Bookings (property rental — not hotel)

```
PropertyBooking ── FK Property, Renter, Owner
Status machine: pending → approved/rejected → active → completed/cancelled
```

### 8.9 Support & messaging

```
Complaint ── FK User, optional property/mess
Dispute ── admin workflow
Chat ── M2M participants
ChatMessage ── FK Chat
Notification ── FK User (in-app)
```

### 8.10 Monetization

```
SubscriptionPlan (config)
OwnerSubscription ── FK User (owner)
FeaturedBoost ── FK Property, duration, paid_at
PlanUsage (flats_used, computed)
```

---

## 9. API surface — complete endpoint map

Maps **frontend `lib/api` function → HTTP endpoint**.  
Method + path is canonical; adjust only with version bump.

### 9.1 Auth & account (`accounts`)

| Frontend                      | Method | Endpoint                                |
| ----------------------------- | ------ | --------------------------------------- |
| —                             | POST   | `/api/v1/auth/otp/request/`             |
| —                             | POST   | `/api/v1/auth/otp/verify/`              |
| —                             | POST   | `/api/v1/auth/role/select/`             |
| —                             | POST   | `/api/v1/auth/token/refresh/`           |
| —                             | POST   | `/api/v1/auth/logout/`                  |
| `requestPhoneChange`          | POST   | `/api/v1/account/phone-change/request/` |
| —                             | POST   | `/api/v1/account/phone-change/confirm/` |
| `recoverAccount`              | POST   | `/api/v1/account/recover/`              |
| `fetchUserVerificationStatus` | GET    | `/api/v1/account/verification/`         |
| `submitVerificationRequest`   | POST   | `/api/v1/account/verification/`         |

### 9.2 Properties / listings (`listings`)

| Frontend                  | Method | Endpoint                                              |
| ------------------------- | ------ | ----------------------------------------------------- |
| `fetchProperties`         | GET    | `/api/v1/properties/`                                 |
| `fetchPropertyById`       | GET    | `/api/v1/properties/{id}/`                            |
| `fetchFeaturedProperties` | GET    | `/api/v1/properties/featured/`                        |
| `fetchPropertyMeta`       | GET    | `/api/v1/properties/meta/`                            |
| `fetchRecommendations`    | GET    | `/api/v1/properties/{id}/recommendations/`            |
| `fetchOwnerListings`      | GET    | `/api/v1/properties/mine/`                            |
| `createListing`           | POST   | `/api/v1/properties/`                                 |
| `updateListing`           | PATCH  | `/api/v1/properties/{id}/`                            |
| `fetchPropertiesByIds`    | POST   | `/api/v1/properties/batch/`                           |
| `fetchPropertyReviews`    | GET    | `/api/v1/properties/{id}/reviews/`                    |
| `fetchReviewSummary`      | GET    | `/api/v1/properties/{id}/reviews/summary/`            |
| `createPropertyReview`    | POST   | `/api/v1/properties/{id}/reviews/`                    |
| `respondToReview`         | POST   | `/api/v1/properties/{id}/reviews/{reviewId}/respond/` |

### 9.3 Portfolio (`portfolio`)

| Frontend                      | Method | Endpoint                                  |
| ----------------------------- | ------ | ----------------------------------------- |
| `fetchBuildings`              | GET    | `/api/v1/buildings/`                      |
| `fetchAllBuildings`           | GET    | `/api/v1/buildings/all/` (admin/internal) |
| `fetchBuildingById`           | GET    | `/api/v1/buildings/{id}/`                 |
| `fetchFloorsByBuilding`       | GET    | `/api/v1/buildings/{id}/floors/`          |
| `fetchFloorById`              | GET    | `/api/v1/floors/{id}/`                    |
| `fetchFloorStats`             | GET    | `/api/v1/floors/{id}/stats/`              |
| `createFloor`                 | POST   | `/api/v1/buildings/{id}/floors/`          |
| `patchFloor`                  | PATCH  | `/api/v1/floors/{id}/`                    |
| `removeFloor`                 | DELETE | `/api/v1/floors/{id}/`                    |
| `fetchFlatsByBuilding`        | GET    | `/api/v1/buildings/{id}/flats/`           |
| `fetchAllFlats`               | GET    | `/api/v1/flats/`                          |
| `fetchRenters`                | GET    | `/api/v1/renters/`                        |
| `fetchOwnerPortfolioSnapshot` | GET    | `/api/v1/portfolio/snapshot/`             |
| `fetchRenterProfile`          | GET    | `/api/v1/profile/renter/`                 |
| `saveRenterProfile`           | PATCH  | `/api/v1/profile/renter/`                 |
| `fetchRenterHistory`          | GET    | `/api/v1/renters/{id}/history/`           |

### 9.4 Property bookings (`bookings`)

| Frontend                 | Method | Endpoint                        |
| ------------------------ | ------ | ------------------------------- |
| `fetchBookingsForRenter` | GET    | `/api/v1/bookings/mine/`        |
| `fetchBookingsForOwner`  | GET    | `/api/v1/bookings/owner/`       |
| `fetchBookingById`       | GET    | `/api/v1/bookings/{id}/`        |
| `createBooking`          | POST   | `/api/v1/bookings/`             |
| `patchBookingStatus`     | PATCH  | `/api/v1/bookings/{id}/status/` |
| `fetchAllBookings`       | GET    | `/api/v1/admin/bookings/`       |

### 9.5 Billing (`billing`)

| Frontend                       | Method | Endpoint                                                         |
| ------------------------------ | ------ | ---------------------------------------------------------------- |
| `fetchBillsBoard`              | GET    | `/api/v1/bills/board/`                                           |
| `fetchBillsForTenant`          | GET    | `/api/v1/bills/mine/`                                            |
| `fetchBillsForOwner`           | GET    | `/api/v1/bills/owner/`                                           |
| `fetchBillById`                | GET    | `/api/v1/bills/{id}/`                                            |
| `saveBillsSnapshot`            | PUT    | `/api/v1/bills/bulk/` (owner batch — prefer granular CRUD in v1) |
| `saveBillTemplates`            | PUT    | `/api/v1/bill-templates/bulk/`                                   |
| `saveBillRules`                | PUT    | `/api/v1/bill-rules/bulk/`                                       |
| `saveMeterReadings`            | PUT    | `/api/v1/meter-readings/bulk/`                                   |
| `markBillAsPaid`               | POST   | `/api/v1/bills/{id}/mark-paid/`                                  |
| `fetchActiveBillTemplates`     | GET    | `/api/v1/bill-templates/active/`                                 |
| `fetchBillTemplatesByProperty` | GET    | `/api/v1/bill-templates/?property_id=`                           |
| `fetchActiveBillRules`         | GET    | `/api/v1/bill-rules/active/`                                     |
| `fetchPreviousMeterReadingApi` | GET    | `/api/v1/meter-readings/previous/`                               |
| `fetchMeterReadingApi`         | GET    | `/api/v1/meter-readings/current/`                                |
| —                              | POST   | `/api/v1/bills/generate/` (from `GenerateBillDialog`)            |
| —                              | POST   | `/api/v1/bills/bulk-generate/`                                   |

### 9.6 Payments (`payments`)

| Frontend                     | Method | Endpoint                                      |
| ---------------------------- | ------ | --------------------------------------------- |
| `fetchPaymentHistory`        | GET    | `/api/v1/payments/history/`                   |
| `fetchScheduledPayments`     | GET    | `/api/v1/payments/scheduled/`                 |
| `fetchPaymentSchedules`      | GET    | `/api/v1/payments/schedules/`                 |
| `payBill`                    | POST   | `/api/v1/payments/pay-bill/`                  |
| `recordCashPaymentApi`       | POST   | `/api/v1/payments/record-cash/`               |
| `fetchOwnerPayouts`          | GET    | `/api/v1/payments/owner/payouts/`             |
| `fetchOwnerPaymentAnalytics` | GET    | `/api/v1/payments/owner/analytics/`           |
| `fetchPaymentByTxnId`        | GET    | `/api/v1/payments/transactions/{txn_id}/`     |
| `createScheduledPayment`     | POST   | `/api/v1/payments/scheduled/`                 |
| `patchScheduledPayment`      | PATCH  | `/api/v1/payments/scheduled/{id}/`            |
| `cancelScheduledPaymentApi`  | POST   | `/api/v1/payments/scheduled/{id}/cancel/`     |
| `settlePayout`               | POST   | `/api/v1/payments/owner/payouts/{id}/settle/` |
| —                            | POST   | `/api/v1/payments/webhooks/bkash/`            |
| —                            | POST   | `/api/v1/payments/webhooks/nagad/`            |
| —                            | POST   | `/api/v1/payments/webhooks/rocket/`           |

### 9.7 Mess (`mess`)

| Frontend                | Method | Endpoint                                                                                      |
| ----------------------- | ------ | --------------------------------------------------------------------------------------------- |
| `fetchMessList`         | GET    | `/api/v1/mess/`                                                                               |
| `fetchMessById`         | GET    | `/api/v1/mess/{id}/`                                                                          |
| `fetchMessStudents`     | GET    | `/api/v1/mess/{id}/students/`                                                                 |
| `fetchMessSeats`        | GET    | `/api/v1/mess/{id}/seats/`                                                                    |
| `fetchNoticesByMess`    | GET    | `/api/v1/mess/{id}/notices/`                                                                  |
| `fetchAllNotices`       | GET    | `/api/v1/notices/`                                                                            |
| `createNotice`          | POST   | `/api/v1/mess/{id}/notices/`                                                                  |
| `patchNotice`           | PATCH  | `/api/v1/notices/{id}/`                                                                       |
| `removeNotice`          | DELETE | `/api/v1/notices/{id}/`                                                                       |
| `acknowledgeMessNotice` | POST   | `/api/v1/notices/{id}/acknowledge/`                                                           |
| `fetchOrCreateMessBill` | POST   | `/api/v1/mess/{id}/bills/get-or-create/`                                                      |
| `fetchMessSmsTemplates` | GET    | `/api/v1/mess/{id}/sms/templates/`                                                            |
| `fetchMessSmsGroups`    | GET    | `/api/v1/mess/{id}/sms/groups/`                                                               |
| messDomain\*            | \*     | `/api/v1/mess/{id}/meals/`, `.../attendance/`, `.../rules/`, `.../expenses/`, `.../sms/send/` |

### 9.8 Hotels (`hotels`)

| Frontend                 | Method | Endpoint                                             |
| ------------------------ | ------ | ---------------------------------------------------- |
| `fetchHotels`            | GET    | `/api/v1/hotels/`                                    |
| `fetchHotelById`         | GET    | `/api/v1/hotels/{id}/`                               |
| `fetchOwnerHotels`       | GET    | `/api/v1/hotels/mine/`                               |
| `registerHotel`          | POST   | `/api/v1/hotels/`                                    |
| `patchHotelPricing`      | PATCH  | `/api/v1/hotels/{id}/pricing/`                       |
| `fetchHotelRooms`        | GET    | `/api/v1/hotels/{id}/rooms/`                         |
| `fetchHotelBookings`     | GET    | `/api/v1/hotels/{id}/bookings/`                      |
| `fetchUserHotelBookings` | GET    | `/api/v1/hotels/bookings/mine/`                      |
| `createHotelBooking`     | POST   | `/api/v1/hotels/{id}/bookings/`                      |
| `fetchHotelReviews`      | GET    | `/api/v1/hotels/{id}/reviews/`                       |
| `fetchRoomPricing`       | GET    | `/api/v1/hotels/{id}/rooms/pricing/`                 |
| —                        | POST   | `/api/v1/hotels/bookings/{id}/cancel/` (refund calc) |

### 9.9 Messaging & support

| Frontend                  | Method | Endpoint                          |
| ------------------------- | ------ | --------------------------------- |
| `fetchUserChats`          | GET    | `/api/v1/chats/`                  |
| `fetchChatMessages`       | GET    | `/api/v1/chats/{id}/messages/`    |
| `sendChatMessage`         | POST   | `/api/v1/chats/{id}/messages/`    |
| `createChat`              | POST   | `/api/v1/chats/`                  |
| `fetchUnreadMessageCount` | GET    | `/api/v1/chats/unread-count/`     |
| `fetchComplaints`         | GET    | `/api/v1/complaints/`             |
| `createComplaint`         | POST   | `/api/v1/complaints/`             |
| `updateComplaintStatus`   | PATCH  | `/api/v1/complaints/{id}/status/` |
| `fetchNotifications`      | GET    | `/api/v1/notifications/`          |

### 9.10 Documents (`documents`)

| Frontend                 | Method | Endpoint                            |
| ------------------------ | ------ | ----------------------------------- |
| `fetchAgreements`        | GET    | `/api/v1/agreements/`               |
| `fetchActiveAgreement`   | GET    | `/api/v1/agreements/active/`        |
| `createAgreement`        | POST   | `/api/v1/agreements/`               |
| `patchAgreement`         | PATCH  | `/api/v1/agreements/{id}/`          |
| `createAgreementRenewal` | POST   | `/api/v1/agreements/{id}/renewals/` |
| `fetchChecklists`        | GET    | `/api/v1/checklists/`               |
| `createChecklist`        | POST   | `/api/v1/checklists/`               |
| `patchChecklist`         | PATCH  | `/api/v1/checklists/{id}/`          |
| `fetchAgreementFormData` | GET    | `/api/v1/agreements/form-data/`     |

### 9.11 Discovery (`discovery`)

| Frontend                        | Method | Endpoint                                |
| ------------------------------- | ------ | --------------------------------------- |
| `fetchFavorites`                | GET    | `/api/v1/favorites/`                    |
| `toggleFavorite`                | POST   | `/api/v1/favorites/toggle/`             |
| `checkIsFavorite`               | GET    | `/api/v1/favorites/check/?property_id=` |
| `fetchSavedSearches`            | GET    | `/api/v1/saved-searches/`               |
| `createSavedSearch`             | POST   | `/api/v1/saved-searches/`               |
| `patchSavedSearch`              | PATCH  | `/api/v1/saved-searches/{id}/`          |
| `deleteSavedSearch`             | DELETE | `/api/v1/saved-searches/{id}/`          |
| `fetchSearchHistory`            | GET    | `/api/v1/search-history/`               |
| `recordSearchHistory`           | POST   | `/api/v1/search-history/`               |
| `fetchSearchMatchNotifications` | GET    | `/api/v1/search/notifications/`         |

### 9.12 Subscriptions (`subscriptions`)

| Frontend                 | Method | Endpoint                                |
| ------------------------ | ------ | --------------------------------------- |
| `fetchOwnerSubscription` | GET    | `/api/v1/subscriptions/mine/`           |
| `fetchFlatLimitStatus`   | GET    | `/api/v1/subscriptions/flat-limit/`     |
| `upgradeOwnerPlan`       | POST   | `/api/v1/subscriptions/upgrade/`        |
| `purchaseFeaturedBoost`  | POST   | `/api/v1/subscriptions/featured-boost/` |

### 9.13 Reports & reminders (`reports`)

| Frontend                 | Method | Endpoint                         |
| ------------------------ | ------ | -------------------------------- |
| `fetchExpenseCategories` | GET    | `/api/v1/expenses/categories/`   |
| `fetchExpenseAnalytics`  | GET    | `/api/v1/expenses/analytics/`    |
| `fetchMonthlyExpenses`   | GET    | `/api/v1/expenses/monthly/`      |
| `fetchYearlyExpenses`    | GET    | `/api/v1/expenses/yearly/`       |
| `fetchBudgets`           | GET    | `/api/v1/expenses/budgets/`      |
| `patchBudget`            | PATCH  | `/api/v1/expenses/budgets/{id}/` |
| `fetchExpenseReports`    | GET    | `/api/v1/reports/expense/`       |
| `createExpenseReport`    | POST   | `/api/v1/reports/expense/`       |
| `fetchTaxDocuments`      | GET    | `/api/v1/reports/tax/`           |
| `createTaxDocument`      | POST   | `/api/v1/reports/tax/`           |
| `fetchReminders`         | GET    | `/api/v1/reminders/`             |
| `createReminder`         | POST   | `/api/v1/reminders/`             |
| `fetchReminderSettings`  | GET    | `/api/v1/reminders/settings/`    |
| `saveReminderSettings`   | PUT    | `/api/v1/reminders/settings/`    |

### 9.14 Admin API (`admin_api`)

| Frontend                    | Method | Endpoint                                  |
| --------------------------- | ------ | ----------------------------------------- |
| `fetchAdminDashboardData`   | GET    | `/api/v1/admin/dashboard/`                |
| `fetchAdminUsers`           | GET    | `/api/v1/admin/users/`                    |
| `fetchManagedUsers`         | GET    | `/api/v1/admin/users/managed/`            |
| `fetchVerificationRequests` | GET    | `/api/v1/admin/verifications/`            |
| `fetchDisputes`             | GET    | `/api/v1/admin/disputes/`                 |
| `fetchPropertyModerations`  | GET    | `/api/v1/admin/properties/moderation/`    |
| `fetchAdminComplaints`      | GET    | `/api/v1/admin/complaints/`               |
| `fetchFraudReports`         | GET    | `/api/v1/admin/fraud-reports/`            |
| `patchFraudReport`          | PATCH  | `/api/v1/admin/fraud-reports/{id}/`       |
| `fetchAdminAnalytics`       | GET    | `/api/v1/admin/analytics/`                |
| `fetchSystemSettings`       | GET    | `/api/v1/admin/settings/`                 |
| `saveSystemSettings`        | PUT    | `/api/v1/admin/settings/`                 |
| `fetchActivityLogs`         | GET    | `/api/v1/admin/activity-logs/`            |
| `fetchAuditLogs`            | GET    | `/api/v1/admin/audit-logs/`               |
| `rollbackAudit`             | POST   | `/api/v1/admin/audit-logs/{id}/rollback/` |

### 9.15 Audit (`audit`)

| Frontend         | Method | Endpoint                                 |
| ---------------- | ------ | ---------------------------------------- |
| `createAuditLog` | POST   | `/api/v1/audit/logs/` (internal + admin) |

---

## 10. Module requirements (detailed)

### Module 1 — Discovery & booking

**User stories (frontend routes):** `/search`, `/properties`, `/listings/[id]`, `/compare`, `/favorites`, `/my-bookings`

**Backend requirements:**

- Full-text + filter query on `Property` (city, area, type, rent range, gender, facilities)
- Geo radius search (PostGIS optional phase 2; v1: city/area indexes)
- Favorites, saved searches, search history per user
- Property booking with status workflow and owner approval
- Reviews with owner response
- Featured flag + boost expiry from `FeaturedBoost`
- SEO: public read endpoints for published listings (`AllowAny` for GET by slug/id)

**Business rules:**

- Only `published` listings appear in search
- `verified` badge requires approved `VerificationDocument`
- Instant book flag bypasses owner approval when enabled

### Module 2 — Apartment management (owner)

**Routes:** `/my-properties/*`, `/bills` (owner), `/notices`

**Backend requirements:**

- CRUD buildings → floors → flats with subscription flat limits
- Assign/unassign tenant to flat (creates `Tenancy`)
- Bill templates, meter readings, generation rules
- Bulk bill generation (Celery task)
- Notice board with PDF/image upload
- Renter history aggregate endpoint for flat detail dialog
- Audit log on bill create/update/payment

**Business rules:**

- Free plan: max 3 flats (`subscriptions.PlanUsage`)
- Overdue bills: `due_date < today` AND status unpaid → overdue (nightly job)

### Module 3 — Renter app

**Routes:** `/dashboard`, `/rentals`, `/bills`, `/payments`, `/complaints`, `/documents`, `/expenses`, `/reports`, `/reminders`

**Backend requirements:**

- Tenant-scoped bill list and payment
- Pay bill → gateway or cash pending
- Scheduled payments + reminder integration
- Complaints with image upload
- Agreements + checklists
- Expense analytics from bills + manual entries
- PDF/HTML receipt generation (server-side template or signed URL)

### Module 4 — Mess & hostel

**Routes:** `/mess/*`, `/mess/student-dashboard/*`

**Backend requirements:**

- Seat inventory with assign student
- Meal menus, attendance, SMS templates/groups/bulk send
- Mess rules, violations, expenses
- Get-or-create monthly mess bill per student
- Student-scoped read for menu, attendance, notices

**Integrations:**

- SMS provider for bulk SMS (async Celery)
- Optional: attendance export CSV

### Module 5 — Hotels

**Routes:** `/hotels/*`, `/my-hotels/*`

**Backend requirements:**

- Hotel registration with license docs
- Room inventory + calendar availability
- Dynamic pricing (weekend/seasonal rules — store as `RoomPrice` or rules engine)
- Booking with fee breakdown (service charge, VAT, advance %)
- Cancellation policy enforcement on cancel endpoint
- Invoice PDF generation
- Hotel reviews

### Module 6 — Payments & finance

**Critical path for launch.**

**Backend requirements:**

- Payment adapter interface:

```python
class PaymentGateway(Protocol):
    def create_payment(self, amount: Decimal, reference: str, ...) -> PaymentIntent: ...
    def verify_webhook(self, request) -> WebhookPayload: ...
```

- Implement: `BkashGateway`, `NagadGateway`, `RocketGateway`, `CashGateway`, `CardGateway` (stub)
- Idempotent webhook processing
- Owner payout ledger with commission from `SystemSettings.commission_rate`
- Analytics aggregation endpoint (monthly totals, by method)

### Module 7 — Admin & trust

**Routes:** `/admin/*`

**Backend requirements:**

- Admin permission matrix (see `lib/admin/permissions.ts`)
- User ban/suspend
- Listing moderation workflow
- Verification approve/reject
- Dispute assignment and resolution
- Fraud report status workflow
- Platform analytics (counts, growth — materialized views or cached aggregates)
- System settings (commission, plan prices)
- Audit log viewer + rollback where `can_rollback=True`

---

## 11. Payments & Bangladesh gateways

### 11.1 Payment flow (bill pay — matches `PayBillDialog`)

```
1. POST /payments/pay-bill/ { bill_id, method, account_number? }
2. Backend creates PaymentTransaction (status=processing)
3. If wallet: call gateway → redirect URL or async callback
4. Webhook updates transaction → completed | failed
5. On completed: Bill.status=paid, create OwnerPayout (minus commission)
6. Frontend polls or redirects to /payments/result?txn=
```

### 11.2 Cash flow

- Renter selects Cash → `status=pending`
- Owner `POST /payments/record-cash/` → completes transaction + marks bill paid

### 11.3 Webhook security

- Verify signature per gateway docs
- Store raw payload in `PaymentWebhookEvent`
- Process only once (unique gateway transaction id)

### 11.4 Commission

```python
commission_amount = gross * settings.commission_rate
net_payout = gross - commission_amount
```

Configurable in `SystemSettings` (admin settings page).

---

## 12. Files, media & documents

| Type               | Storage                            | Max size | MIME            |
| ------------------ | ---------------------------------- | -------- | --------------- |
| Property images    | S3 `media/listings/`               | 5 MB     | jpeg, png, webp |
| NID / verification | S3 `media/verification/` (private) | 5 MB     | jpeg, png, pdf  |
| Notice PDF         | S3 `media/notices/`                | 10 MB    | pdf             |
| Agreement          | S3 `media/agreements/` (private)   | 10 MB    | pdf             |
| Receipt photo      | S3 `media/receipts/`               | 5 MB     | jpeg, png       |
| Chat attachments   | S3 `media/chat/`                   | 5 MB     | images, pdf     |

**Access:** private files via short-lived signed URLs (boto3 `generate_presigned_url`).

**Django:** `DEFAULT_FILE_STORAGE` = `storages.backends.s3boto3.S3Boto3Storage`

---

## 13. Background jobs & notifications

### Celery tasks (v1)

| Task                         | Schedule | Purpose                   |
| ---------------------------- | -------- | ------------------------- |
| `generate_scheduled_bills`   | Daily    | `BillGenerationRule`      |
| `mark_overdue_bills`         | Daily    | Update bill status        |
| `process_scheduled_payments` | Hourly   | Auto-pay if enabled       |
| `send_rent_reminders`        | Daily    | SMS/push from `Reminder`  |
| `send_saved_search_alerts`   | Daily    | Match new listings        |
| `expire_featured_boosts`     | Daily    | Clear `Property.featured` |
| `aggregate_admin_analytics`  | Hourly   | Cache dashboard stats     |

### Notification channels

| Channel    | v1                      | v2            |
| ---------- | ----------------------- | ------------- |
| In-app     | ✅ `Notification` model | —             |
| SMS        | ✅ OTP + reminders      | Bulk mess SMS |
| Push (FCM) | ❌                      | Mobile app    |
| Email      | Optional                | Receipts      |

---

## 14. Real-time (phase 2)

| Feature            | Technology                                            |
| ------------------ | ----------------------------------------------------- |
| Chat               | Django Channels + Redis, or third-party (Pusher/Ably) |
| Live notifications | WebSocket `/ws/notifications/`                        |
| Booking updates    | WebSocket or SSE                                      |

v1: polling (`fetchUnreadMessageCount` every 5s — matches frontend).

---

## 15. Admin & operations

### Django Admin (internal)

Use Django Admin for:

- Support debugging (read-only production)
- Manual user fixes
- System settings backup

Primary admin UX remains **Next.js `/admin`** calling `admin_api`.

### Management commands

- `seed_demo_data` — mirror frontend mocks for dev
- `create_admin_user`
- `reconcile_payments`

---

## 16. Security & compliance

| Area          | Requirement                                              |
| ------------- | -------------------------------------------------------- |
| HTTPS         | TLS everywhere                                           |
| CORS          | Whitelist `NEXT_PUBLIC_SITE_URL`                         |
| Rate limit    | OTP: 5/hour/phone; login: django-ratelimit               |
| SQL injection | Django ORM only                                          |
| XSS           | API returns JSON; frontend sanitizes UGC                 |
| PII           | Encrypt NID numbers at rest (optional field-level)       |
| Audit         | Financial mutations logged                               |
| GDPR/local    | Privacy policy alignment; data export endpoint (phase 2) |

---

## 17. Observability & audit

- **Logging:** structlog JSON → CloudWatch / Loki
- **Errors:** Sentry
- **Metrics:** request latency, payment success rate
- **AuditLog:** `action`, `entity_type`, `entity_id`, `user`, `changes` JSON, `rollback_data`, `ip`, `user_agent`

Frontend `utils/audit.ts` → `POST /api/v1/audit/logs/` for client-origin events; server also logs on mutations.

---

## 18. Frontend integration contract

### 18.1 Environment (frontend `.env`)

```bash
NEXT_PUBLIC_API_URL=https://api.smartliving.bd/api/v1
```

### 18.2 Replace `lib/api/http.ts`

```typescript
export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
      ...options?.headers,
    },
  })
  return res.json() as Promise<ApiResult<T>>
}
```

### 18.3 Auth storage (replace sessionStorage)

- Access token: memory or `sessionStorage`
- Refresh token: **httpOnly cookie** (recommended) or secure storage
- Remove `demo-identity` keys when real auth ships

### 18.4 Migration order per frontend module

1. `accounts` + `lib/api/demoUser` → real JWT user
2. `listings` + `portfolio`
3. `billing` + `payments`
4. `bookings` + `hotels`
5. `mess` + `messaging`
6. `admin_api` + `subscriptions`

### 18.5 OpenAPI sync

- Generate schema: `drf-spectacular` → `/api/v1/schema/`
- Optional: codegen TypeScript types into `types/api/` to drift-check against hand-written types

---

## 19. Implementation phases

Build in this order. Each phase ends with **frontend integration test** against real API.

### Phase 0 — Foundation (Week 1)

- [ ] Create `smart-living-api` Django project
- [ ] PostgreSQL, Redis, S3 (MinIO local)
- [ ] Custom `User` model, settings split dev/prod
- [ ] `ApiResult` envelope + exception handler
- [ ] JWT auth skeleton
- [ ] drf-spectacular OpenAPI
- [ ] CORS + health check `GET /api/v1/health/`

### Phase 1 — Auth & accounts (Week 2)

- [ ] OTP request/verify (SMS adapter stub in dev)
- [ ] Role selection, profile CRUD
- [ ] Verification document upload
- [ ] Wire frontend: login → OTP → dashboard

### Phase 2 — Listings & discovery (Week 3)

- [ ] Property CRUD, images, search filters
- [ ] Favorites, saved searches, search history
- [ ] Reviews
- [ ] Wire: `/search`, `/listings/[id]`, `/favorites`

### Phase 3 — Portfolio & billing (Week 4–5)

- [ ] Buildings, floors, flats, tenancy
- [ ] Bills, templates, meter readings, generation
- [ ] Subscription flat limits
- [ ] Wire: `/my-properties`, `/bills`

### Phase 4 — Payments (Week 6–7) **critical**

- [ ] PaymentTransaction, pay-bill, cash record
- [ ] bKash sandbox + webhook
- [ ] Nagad/Rocket adapters (stubs → sandbox)
- [ ] Owner payouts + commission
- [ ] Wire: `PayBillDialog`, `/payments`

### Phase 5 — Bookings & hotels (Week 8)

- [ ] Property bookings workflow
- [ ] Hotel, rooms, pricing, hotel bookings
- [ ] Cancellation + fee breakdown
- [ ] Wire: `/my-bookings`, `/hotels/*/book`

### Phase 6 — Mess module (Week 9)

- [ ] Mess, seats, students, notices
- [ ] Meals, attendance, SMS, rules, expenses
- [ ] Wire: `/mess/*`, student dashboard

### Phase 7 — Renter tools & documents (Week 10)

- [ ] Complaints, agreements, checklists
- [ ] Expenses, reports, reminders
- [ ] Notifications
- [ ] Wire: remaining renter pages

### Phase 8 — Admin & monetization (Week 11)

- [ ] Admin API + permissions
- [ ] Fraud, disputes, moderation
- [ ] Subscriptions, featured boost
- [ ] Audit logs
- [ ] Wire: `/admin/*`, `/subscription`

### Phase 9 — Hardening (Week 12)

- [ ] Rate limits, security audit
- [ ] Celery tasks (reminders, overdue bills)
- [ ] Load testing payment webhooks
- [ ] Production deployment + CI/CD
- [ ] Remove `mockDelay` from frontend `lib/api`

---

## 20. Future extensibility

### 20.1 Multi-role users

```python
class UserRoleAssignment(models.Model):
    user = models.ForeignKey(User)
    role = models.CharField(choices=Role.choices)
    is_primary = models.BooleanField(default=False)
```

Frontend already supports role selection; backend stores multiple roles, session picks active.

### 20.2 Multi-tenancy (white-label SaaS)

```python
class Organization(models.Model):
    name = models.CharField(...)
    slug = models.SlugField(unique=True)
    custom_domain = models.CharField(null=True)
```

Add `organization_id` FK to Building, Mess, Hotel, Property. Middleware resolves tenant from domain.

### 20.3 Plugin-style payment gateways

```python
# payments/gateways/registry.py
GATEWAYS = {
    'bkash': BkashGateway,
    'nagad': NagadGateway,
}
```

### 20.4 Event bus (phase 3)

Publish domain events (`BillPaid`, `BookingApproved`) to Redis streams for analytics, notifications, Flutter sync.

### 20.5 PostGIS

Add `PointField` on Property/Hotel for map radius search when Google Maps integration moves server-side.

### 20.6 Flutter mobile

Same `/api/v1/` — no backend fork. Add device token endpoints for FCM.

---

## Appendix A — Entity relationship overview

```mermaid
erDiagram
    User ||--o| UserProfile : has
    User ||--o| AdminProfile : has
    User ||--o{ Property : owns
    User ||--o{ Building : owns
    Building ||--{ Floor : contains
    Floor ||--{ Flat : contains
    Flat ||--o| Tenancy : has
    Tenancy }o--|| User : tenant
    User ||--o{ Bill : tenant_bills
    Bill ||--{ BillItem : contains
    Bill ||--o{ PaymentTransaction : paid_by
    User ||--o{ Mess : owns
    Mess ||--{ Seat : has
    Mess ||--{ Student : enrolls
    User ||--o{ Hotel : owns
    Hotel ||--{ Room : has
    Hotel ||--{ HotelBooking : receives
    User ||--o{ PropertyBooking : requests
    Property ||--o{ PropertyBooking : listed
    User ||--o{ Complaint : files
    User ||--o{ OwnerSubscription : subscribes
```

---

## Appendix B — Environment variables

### Django (`smart-living-api/.env`)

```bash
# Core
DJANGO_SECRET_KEY=
DJANGO_DEBUG=false
ALLOWED_HOSTS=api.smartliving.bd,localhost
CORS_ALLOWED_ORIGINS=https://smartliving.bd,http://localhost:3000

# Database
DATABASE_URL=postgres://user:pass@localhost:5432/smart_living

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_ACCESS_MINUTES=15
JWT_REFRESH_DAYS=7

# Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=smart-living-media
AWS_S3_REGION_NAME=ap-southeast-1

# SMS
SMS_PROVIDER=ssl_wireless
SMS_API_KEY=
SMS_SENDER_ID=

# Payments (sandbox)
BKASH_APP_KEY=
BKASH_APP_SECRET=
BKASH_USERNAME=
BKASH_PASSWORD=
NAGAD_MERCHANT_ID=
ROCKET_MERCHANT_ID=

# Platform
COMMISSION_RATE=0.05
DEFAULT_CURRENCY=BDT
```

### Frontend (add when integrating)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Document maintenance

| When                            | Action                              |
| ------------------------------- | ----------------------------------- |
| New frontend `lib/api` function | Add row to §9 endpoint map          |
| New Django app                  | Update §5 and §19 phase             |
| Breaking API change             | Bump `/api/v2/`, document migration |
| Gateway go-live                 | Update §11 with production URLs     |

---

_This document is the single source of truth for backend implementation. Build phase-by-phase per §19; keep frontend `lib/api/contracts.ts` and this file in sync._
