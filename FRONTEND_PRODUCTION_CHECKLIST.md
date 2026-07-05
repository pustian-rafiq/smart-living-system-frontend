# Frontend Production Checklist

**Project:** Smart Living Ecosystem (Bangladesh)  
**Scope:** Frontend only — complete UI/UX before backend work  
**Reviewed against:** `project_proposal.txt`, `FRONTEND_STATUS.md`, `MISSING_FEATURES.md`, `FEATURE_GAPS_AND_IMPROVEMENTS.md`, `ENHANCED_BILL_ITEMS_ANALYSIS.md`, and the live codebase (`app/`, `components/`, `data/`, `lib/api/`)  
**Date:** July 2026

---

## How to read this file

| Mark | Meaning |
|------|---------|
| ✅ **Done** | Screen/flow exists and is usable with mock data |
| ⚠️ **Partial** | UI exists but incomplete, broken links, or not production-quality |
| ❌ **Missing** | Not built — important for a production-ready frontend |
| 🔵 **Backend later** | UI is enough for now; real behavior needs API (do not block frontend completion) |

**Note:** Older docs (`MISSING_FEATURES.md`, `FRONTEND_STATUS.md`) are outdated. Hotel and Admin modules **do exist** in the codebase. This checklist is the current source of truth for frontend work.

**Overall frontend estimate:** ~85% of proposal UI screens exist. Remaining work is **production polish, missing payment/legal/monetization UI, route protection, and consistency** — not greenfield modules.

---

## 1. Executive summary

### What is solid (frontend)

- **55 routes** covering discovery, auth, renter, owner, mess, hotel, admin
- **~157 components** with shadcn/ui, forms (RHF + Zod), role-aware nav
- Theme (light/dark), full Bangla/English i18n, mobile-first layout
- Mock data layer (`data/mock*.ts`) + partial mock API (`lib/api/`)
- Core product flows are clickable end-to-end on mocks

### What blocks calling the frontend “production-ready”

1. **No real Pay Now / payment checkout UI** (only schedule + method labels)
2. ~~**Broken legal/support links**~~ (`/terms`, `/privacy`, `/help`, `/faq`, `/safety`) — **fixed**
3. ~~**No route protection**~~ — client guards done (`RouteAuthGuard`); server auth still needed
4. **No global error/loading/not-found UX**
5. ~~**No toast/feedback system**~~ — ✅ `FeedbackProvider` + sonner toasts + `useConfirm`
6. **Hardcoded demo users** (`r1`, etc.) instead of session-driven identity
7. **Inconsistent data layer** (most pages import mocks directly; only some use `lib/api`)
8. **Monetization UI missing** (owner subscription, featured listing purchase)
9. ~~**i18n incomplete**~~ — ✅ Full app localization (en default + bn via switcher)
10. **No tests**, weak SEO (per-route metadata done ✅), no full PWA offline

---

## 2. Foundation & infrastructure

| Item | Status | Notes |
|------|--------|-------|
| Next.js 15 App Router + TypeScript | ✅ Done | |
| Tailwind + shadcn/ui design system | ✅ Done | |
| Theme provider (light/dark) | ✅ Done | |
| Language provider (bn/en) | ✅ Done | `next-intl` + 19 namespaces; default **English**; switcher in header/auth/profile |
| Path aliases (`@/`) | ✅ Done | |
| Layout: Header, Navbar, BottomNav, Footer | ✅ Done | |
| Page chrome (`PageHeader`, `EmptyState`, `LoadingState`) | ✅ Done | |
| Mock data for all major entities | ✅ Done | |
| Mock API layer (`lib/api/`) | ⚠️ Partial | Only properties, bookings, rentals, demoUser |
| Migrate all pages to `lib/api` + `useMockQuery` | ❌ Missing | **Important** — makes backend swap painless |
| Session-driven user id (not hardcoded `r1`) | ❌ Missing | **Important** |
| Auth middleware / protected routes | ⚠️ Partial | Client `RouteAuthGuard` + role rules; server middleware/cookies in backend phase |
| Role guard (renter / owner / admin / student) | ⚠️ Partial | Client checks only; admin unguarded |
| Global `error.tsx` / `loading.tsx` / `not-found.tsx` | ❌ Missing | **Important** |
| Toast / notification feedback (replace `alert`) | ❌ Missing | **Important** |
| Form success/error UX consistency | ⚠️ Partial | Mix of alerts and silent updates |
| Optimistic UI patterns | 🔵 Backend later | Optional for frontend phase |
| Unit / component / E2E tests | ❌ Missing | Important before launch |
| ESLint/TS clean build (no ignore flags) | ⚠️ Partial | `next.config` may ignore build errors |
| Env example for Maps / future API URL | ✅ Done | `.env.example` includes `NEXT_PUBLIC_SITE_URL` |

---

## 3. MODULE 1 — Accommodation discovery & booking

| Item | Status | Notes |
|------|--------|-------|
| Search page with filters | ✅ Done | `/search` |
| City / area filters | ✅ Done | |
| Property types: Mess, Hostel, Hotel, Apartment | ✅ Done | |
| Rent range, gender, seat type, meal filters | ✅ Done | |
| Advanced filters (facilities, age, floor, furnished, parking, security) | ✅ Done | |
| Verified-only filter + verification badge | ✅ Done | |
| List / map toggle + `PropertyMap` | ✅ Done | Needs valid Google Maps key in prod |
| Location / radius search | ✅ Done | UI present |
| Property cards + detail dialog | ✅ Done | Ratings, instant badge, compare, link to public page |
| Image gallery | ✅ Done | |
| Video walkthrough player | ✅ Done | Component exists; depends on mock URLs |
| Favorites / wishlist | ✅ Done | `/favorites` |
| Saved searches | ✅ Done | `/saved-searches` |
| Search history | ✅ Done | `/search-history` |
| Featured browse page | ✅ Done | `/properties` (booking + confirmation wired) |
| Instant booking / seat request flow | ✅ Done | Instant vs request; conflict checks; deposit calc via `lib/api/bookings` |
| Booking confirmation UI | ✅ Done | Status-aware (instant approved vs pending request) |
| Owner booking requests (accept/reject) | ✅ Done | Live status updates + complete; `/my-properties/bookings` |
| Guest my-bookings | ✅ Done | Cancel with reason; detail timeline; `/my-bookings` |
| Booking status consistency | ✅ Done | `BookingStatusBadge`, detail dialog, timeline for all states |
| In-app chat UI | ✅ Done | `/messages` (mock, not realtime) |
| Property reviews (mess/apartment) | ✅ Done | `ReviewsSection` on `/listings/[id]`; mock reviews + submit |
| Property comparison | ✅ Done | Compare up to 3 from search → `/compare` |
| Similar listings recommendations | ✅ Done | Rule-based (city/type/rent); ML AI still later phase |
| Public listing SEO pages | ✅ Done | `/listings/[id]` with `generateMetadata` + Open Graph |
| Owner listing create/edit wizard | ✅ Done | `/my-listings`, `/my-listings/new`, edit + publish/pause |

**Module 1 frontend: complete** for production-ready UI (mock API). Remaining for backend: real auth, payments on booking, live chat, true SEO crawl of dynamic listings.

---

## 4. MODULE 2 — Apartment management (owner)

| Item | Status | Notes |
|------|--------|-------|
| Buildings list | ✅ Done | `/my-properties` |
| Add building | ✅ Done | `AddBuildingDialog` |
| Floors management | ✅ Done | `/my-properties/buildings/[id]/floors` (add/edit/delete) |
| Flats list + status/floor filter | ✅ Done | `/my-properties/buildings/[id]/flats` |
| Flat detail (assign renter, bills, history) | ✅ Done | `AssignRenterDialog` + deep-link to `/bills?action=generate` |
| Floor-wise stats | ✅ Done | `.../floors/[floorId]/stats` |
| Renter profile: NID/passport upload UI | ✅ Done | `/profile` → Documents (all roles) |
| Owner trust documents (NID / police verification) | ✅ Done | Same Documents tab; owner seed data included |
| Job / institute fields | ✅ Done | Profile → Job card (all roles) |
| Family members + emergency contact | ✅ Done | Profile → Family tab (all roles) |
| Bills list (owner view) | ✅ Done | `/bills` (role = owner) |
| Manual bill generation | ✅ Done | |
| Bill templates + unit rates | ✅ Done | |
| Meter readings (electricity/gas/water) | ✅ Done | |
| Previous reading + consumption calc | ✅ Done | |
| Template-based bill generation (auto calc) | ✅ Done | `GenerateBillDialog` |
| Service charge (fixed / %) in templates | ✅ Done | Percentage items auto-calc from base in template mode |
| Bill generation rules (scheduled) | ✅ Done | UI for rules (mock schedule) |
| Bulk bill generation | ✅ Done | |
| Mark bill paid | ✅ Done | Owner toggle |
| Notice board (PDF/image) | ✅ Done | `/notices` |
| Bulk notices | ✅ Done | |
| Complaints (owner view) | ✅ Done | `/complaints` |
| Renter history dialog | ✅ Done | From flat detail |
| Audit logs UI | ✅ Done | `/admin/audit-logs` (admin role) |
| Police verification upload UI | ✅ Done | Document type `police_verification` on `/profile` |
| Bulk SMS (owner) | ✅ Done | From bills/mess SMS dialogs |
| Owner dashboard stats | ✅ Done | `/dashboard` as owner |

**Reusable components (Module 2):** `BuildingCard`, `AddBuildingDialog`, `FloorCard`, `FloorDialog`, `FlatCard`, `FlatDetailDialog`, `AssignRenterDialog`, `FlatStatusBadge`, bill/notice/bulk dialogs.

**Owner UI test paths:** see response / run through login as **Owner** below.

**Known mock limits:** data resets on full refresh for some in-memory mutations; receipts still mock download; real SMS/payment needs backend.

---

## 5. MODULE 3 — Renter / tenant app

| Item | Status | Notes |
|------|--------|-------|
| Role-aware dashboard | ✅ Done | `/dashboard` |
| Current rental summary | ✅ Done | `/rentals` |
| Bills list + breakdown | ✅ Done | `/bills` |
| Payment history | ✅ Done | `/payments` → Payment history tab (`PaymentHistoryCard`) |
| Schedule payment UI | ✅ Done | `/payments` → Scheduled tab |
| **Pay Now checkout UI** (bKash/Nagad/Rocket/Cash) | ✅ Done | `PayBillDialog` on bills + payments (method → confirm → result + receipt) |
| Due reminders UI | ✅ Done | `/reminders` |
| Maintenance / complaints | ✅ Done | `/complaints` |
| Notices | ✅ Done | `/notices` |
| Digital agreement view/upload | ✅ Done | `/documents` |
| Move-in / move-out checklist | ✅ Done | Checklist components + documents |
| Expense analytics + charts | ✅ Done | `/expenses` |
| Expense reports / tax docs UI | ✅ Done | `/reports` |
| Receipt download | ✅ Done | `DownloadBillButton` (HTML / text / PDF new tab / print) |
| Notifications center | ✅ Done | `/notifications` |
| Profile edit + settings | ✅ Done | `/profile` |
| Favorites / messages | ✅ Done | |

**Reusable payment pieces:** `PayBillDialog`, `PaymentHistoryCard`, `lib/api/payments.ts`, `processBillPayment` / `markBillPaid` mocks.

**Renter test path:** Login as renter → `/bills` → **Pay Now** on unpaid bill → choose bKash/Nagad/Rocket/Cash → confirm → success → download receipt → `/payments` history.

---

## 6. MODULE 4 — Mess & hostel management

| Item | Status | Notes |
|------|--------|-------|
| Mess overview (seats, fee, occupancy) | ✅ Done | `/mess` (owner manage / renter → student hub) |
| Assign student | ✅ Done | Updates seats + student list (mock) |
| Student dashboard | ✅ Done | `/mess/student-dashboard` |
| Meal schedule / menu upload (owner) | ✅ Done | `/mess/[messId]/meals` |
| Student menu view | ✅ Done | `/mess/student-dashboard/menu` |
| Attendance (owner + student) | ✅ Done | |
| Attendance calendar / reports | ✅ Done | |
| Bulk SMS UI | ✅ Done | `/mess/[messId]/sms` |
| Mess rules + violations | ✅ Done | `/mess/[messId]/rules` |
| Mess expenses | ✅ Done | `/mess/[messId]/expenses` |
| Student monthly bill / pay CTA | ✅ Done | `PayBillDialog` + `getOrCreateMessBill` |
| Notice board (mess) | ✅ Done | `EnhancedNoticeBoard` |

**Reusable:** `MessManageLinks`, `MessOverviewCard`, shared `PayBillDialog` / `DownloadBillButton`.

**Owner path:** Dashboard → Mess & Hostel → `/mess` → manage meals/attendance/SMS/rules/expenses per card · Assign student.  
**Student path:** Dashboard → My Mess → Pay Now → checkout → receipt.

---

## 7. MODULE 5 — Hotel / guest house

| Item | Status | Notes |
|------|--------|-------|
| Hotel search / listing | ✅ Done | `/hotels` |
| Hotel detail | ✅ Done | `/hotels/[hotelId]` + cancellation policy |
| Room cards, amenities, pricing display | ✅ Done | |
| Booking flow | ✅ Done | dates → room → guest → **payment** → confirmation |
| Booking calendar (guest + owner) | ✅ Done | |
| Payment checkout (bKash/Nagad/Rocket/Cash) | ✅ Done | `HotelPaymentDialog` (advance pay) |
| Rating & review UI | ✅ Done | Hotel-specific |
| Owner hotel dashboard | ✅ Done | `/my-hotels` |
| Room inventory management | ✅ Done | `.../rooms` |
| Owner bookings management | ✅ Done | `.../bookings` |
| Owner calendar | ✅ Done | `.../calendar` |
| Hotel registration / onboarding wizard | ✅ Done | `/my-hotels/new` (license, pricing, policy) |
| Dynamic / seasonal pricing UI | ✅ Done | `/my-hotels/[id]/pricing` weekend + seasonal rules |
| Refund / cancellation policy UI | ✅ Done | `CancellationPolicyCard` on detail + book |
| Taxes/fees breakdown on booking | ✅ Done | `BookingFeeBreakdown` (service charge + VAT + advance) |
| Invoice generation UI | ✅ Done | `DownloadInvoiceButton` (PDF/HTML/print) |

**Reusable:** `BookingFeeBreakdown`, `CancellationPolicyCard`, `HotelPaymentDialog`, `DownloadInvoiceButton`, `lib/hotel/pricing.ts`, `lib/download/hotelInvoice.ts`.

---

## 8. MODULE 6 — Payments & finance (frontend)

| Item | Status | Notes |
|------|--------|-------|
| Payment method types (bKash, Nagad, Rocket, Cash, Card) | ✅ Done | `PaymentMethodSelector`, types + checkout |
| Schedule payment | ✅ Done | |
| Cash method option | ✅ Done | Renter pending until owner confirms |
| **Pay Now flow UI** | ✅ Done | `PayBillDialog` — method → confirm → processing → result |
| Payment status screens (pending / success / failed) | ✅ Done | In-dialog + `/payments/result?txn=` |
| Auto-receipt UI (view + download) | ✅ Done | `ReceiptViewDialog` + `lib/download/paymentReceipt.ts` |
| Cash payment record entry (owner marks cash received) | ✅ Done | `RecordCashPaymentDialog` on bills page |
| Owner payout tracking UI | ✅ Done | `OwnerPaymentsPanel` → Payout ledger tab |
| Commission display (owner/admin) | ✅ Done | `CommissionBreakdownCard` + admin rate in analytics |
| Payment analytics UI | ✅ Done | `OwnerPaymentAnalyticsPanel` (owner-facing charts) |
| Payment reminders UI | ✅ Done | Reminders module |

**Reusable:** `PaymentMethodSelector`, `PaymentProcessingState`, `PaymentResultView`, `ReceiptViewDialog`, `RecordCashPaymentDialog`, `CommissionBreakdownCard`, `PayoutLedgerTable`, `OwnerPaymentAnalyticsPanel`.

**TODO (backend / gateway):** Wire real bKash, Nagad, Rocket, SSLCommerz/Card APIs in `lib/api/payments.ts` (placeholders marked).

---

## 9. MODULE 7 — Admin & trust system

| Item | Status | Notes |
|------|--------|-------|
| Admin layout + nav | ✅ Done | |
| Admin dashboard overview | ✅ Done | `/admin` |
| User management | ✅ Done | `/admin/users` |
| Property moderation | ✅ Done | `/admin/properties` |
| Complaints management | ✅ Done | `/admin/complaints` |
| Verifications | ✅ Done | `/admin/verifications` |
| Disputes | ✅ Done | `/admin/disputes` |
| Analytics | ✅ Done | `/admin/analytics` |
| Settings (commission, subscription plans config) | ✅ Done | `/admin/settings` |
| Audit logs | ✅ Done | `/admin/audit-logs` |
| Admin bookings page | ✅ Done | `/admin/bookings` — filters, stats, admin actions |
| Fraud reports UI | ✅ Done | `/admin/fraud-reports` |
| Demand heatmap UI | ❌ Missing | Later / medium |
| Admin login / role gate | ✅ Done | `/admin/login` + `AdminAuthGuard` on all admin routes |
| Super-admin vs moderator roles UI | ✅ Done | Role badge, nav filtering, permission-gated actions |

**Frontend priority:** demand heatmap (later). Admin demo login: `/admin/login` — super-admin `+8801711111111`, moderator `+8801722222222`, support `+8801733333333` (OTP `123456`).

---

## 10. Monetization UI (proposal section 4)

| Item | Status | Notes |
|------|--------|-------|
| Admin configures subscription plans | ✅ Done | Settings page (display) |
| Owner subscription dashboard (plan, usage, upgrade) | ✅ Done | `/subscription` + `OwnerSubscriptionPanel` |
| Free tier limit UX (e.g. max 3 flats warning) | ✅ Done | `FreeTierLimitBanner` on dashboard & my-properties; block dialog at limit |
| Featured listing purchase / boost UI | ✅ Done | `BoostListingDialog` on `/my-listings` |
| Featured badge on cards | ✅ Done | `FeaturedBadge` on PropertyCard, HotelCard, owner listings |
| Commission per booking display | ✅ Done | `BookingCommissionSummary` / inline on owner booking views |
| White-label / SaaS branding | ❌ Missing | Later phase |

---

## 11. Legal, trust & marketing pages

| Item | Status | Notes |
|------|--------|-------|
| Home / marketing landing | ✅ Done | `/` |
| About | ✅ Done | `/about` |
| Contact | ✅ Done | `/contact` |
| Terms & Conditions | ✅ Done | `/terms` — BD-appropriate legal sections + TOC |
| Privacy Policy | ✅ Done | `/privacy` |
| Help Center | ✅ Done | `/help` — searchable category grid |
| FAQ | ✅ Done | `/faq` — filterable accordion |
| Anti-scam / safety tips page | ✅ Done | `/safety` — BD rental scam guide |

**Critical:** footer and login links verified — no 404s for legal/support routes.

---

## 12. Auth & account (frontend)

| Item | Status | Notes |
|------|--------|-------|
| Login (phone +880) | ✅ Done | |
| OTP verify UI | ✅ Done | |
| Role selection | ✅ Done | |
| Session flags in `sessionStorage` | ✅ Done | Demo only |
| Logout | ✅ Done | Via `utils/auth` |
| Admin role in role selection | ✅ Done | Shown for demo admin phones + link to `/admin/login` |
| Account recovery / change phone UI | ✅ Done | `/account/recover`, `/account/change-phone` |
| Profile verification status UX | ✅ Done | Verification tab + `UserVerificationPanel` + status badges |
| Force login on protected pages | ✅ Done | `RouteAuthGuard` in root layout (demo sessionStorage) |

---

## 13. Cross-cutting production quality

### UX consistency

| Item | Status |
|------|--------|
| Empty states on list pages | ✅ Done | `EmptyState` on favorites, complaints, hotels, my-hotels, properties, rentals, bookings, mess, etc. |
| Loading skeletons | ✅ Done | `LoadingState` + `ListPageSkeleton` (spinner + skeleton variants) |
| Consistent date/currency formatting (৳, bn-BD) | ✅ Done | `lib/format/locale.ts` — `formatCurrency`, `formatDate`, `formatNumber`; used in PropertyCard, BillCard, OwnerDashboard, my-hotels |
| Replace `alert`/`confirm` with dialogs + toasts | ✅ Done | `FeedbackProvider` + `toast` (sonner) + `useConfirm` — all pages migrated |
| Onboarding wizards (first owner / mess / hotel) | ✅ Done | `OnboardingWizard` + role dialogs on dashboard, `/mess`, `/my-hotels` |
| Offline / network-required messaging | ✅ Done | `OfflineBanner` in `Layout` via `useOnlineStatus` |

### Accessibility

| Item | Status |
|------|--------|
| Basic semantic HTML / shadcn a11y | ✅ Done | `main#main-content`, skip link, `aria-current`, semantic landmarks |
| Full keyboard nav audit | ✅ Done | Skip-to-content, focus-visible rings, OTP arrow keys, map property list, nav `aria-current` |
| ARIA on custom widgets (map, OTP, charts) | ✅ Done | `OtpInputGroup`, `AccessibleChart`, `PropertyMap` listbox + live region |
| Color contrast check | ✅ Done | WCAG AA tokens in `globals.css` + `lib/a11y/contrast-tokens.ts` |

### i18n

| Item | Status |
|------|--------|
| Auth screens bn/en | ✅ Done | `locales/*/auth.json` |
| Full app copy in Bangla | ✅ Done | All namespaces: common, nav, auth, dashboard, layout, property, profile, feedback, bills, payments, mess, hotels, admin, search, legal, portfolio, tools, home, account |
| Persist language choice | ✅ Done | Cookie `NEXT_LOCALE` + localStorage sync; default **English**; `LanguageSwitcher` in header, auth, profile |
| Date/number locale formatting | ✅ Done | `useAppFormat()` + `lib/format/locale.ts` bound to active locale |

### SEO & PWA

| Item | Status |
|------|--------|
| Root metadata | ✅ Done | Locale-aware via `seo` namespace + `metadataBase` |
| Per-page metadata (public routes) | ✅ Done | `lib/seo/` + segment `layout.tsx` on discovery, legal, auth; dynamic listings & hotels |
| Open Graph / social cards | ✅ Done | `buildMetadata()` + `app/opengraph-image.tsx` + per-listing images |
| `sitemap.xml` / `robots.txt` | ✅ Done | `app/sitemap.ts` (static + listings + hotels), `app/robots.ts` with disallow rules |
| PWA manifest + install prompt | ✅ Done | `app/manifest.ts`, `public/icons/icon.svg`, `InstallPrompt` component |
| Service worker / offline | ❌ Missing | Later — manifest only; no offline cache yet |

### Security (frontend-side)

| Item | Status |
|------|--------|
| Client route guards | ✅ Done | `RouteAuthGuard` + `AdminAuthGuard` + `lib/auth/role-routes.ts` (login, role, admin permissions) |
| No secrets in client bundle | ✅ Done | `assertNoSecretsInPublicEnv()` in dev; only `NEXT_PUBLIC_*` documented in `.env.example` |
| File upload size/type validation UI | ✅ Done | `lib/security/file-upload.ts` presets + validation in upload forms |
| XSS-safe rendering patterns | ✅ Done | `SafeText` / `SafeLink` + `sanitizeUrl` / `sanitizePlainText` for UGC (complaints, chat, notices, reviews) |

---

## 14. Data layer readiness (frontend work before backend)

Do this **before** backend so API swap is mechanical:

| Task | Status | Notes |
|------|--------|-------|
| `lib/api` for properties, bookings, rentals | ✅ Done | `lib/api/properties.ts`, `bookings.ts`, `rentals.ts` + `patchBookingStatus` / `updateBookingStatus` re-export |
| `lib/api` for bills, payments, messages, mess, hotels, admin, notices, complaints | ✅ Done | `bills`, `payments`, `messages`, `mess`, `messDomain`, `hotels`, `admin`, `complaints`, `documents`, `search`, `favorites`, etc. in `lib/api/` |
| All pages use `useMockQuery` / API functions (no direct `mock*` imports in pages) | ✅ Done | All `app/**/page.tsx` routes load via `lib/api/*`; SSG listing metadata uses `getPropertyById` from API layer |
| Single `ApiResult<T>` error shape used everywhere | ✅ Done | `lib/api/http.ts` `ApiResult<T>` + `ok()` / `err()` used across all `lib/api/*` modules |
| Typed request/response contracts documented | ✅ Done | `lib/api/contracts.ts` documents GET/POST shapes for major endpoints |
| Remove hardcoded `userId: 'r1'` — use `getDemoUserId()` / session | ✅ Done | `lib/api/demoUser.ts` helpers; `AppHeader`, `SchedulePaymentDialog`, and payment panels use session-aware ids |

---

## 15. Priority backlog — finish frontend for production

Work top-down. Items marked **P0** are required before a public production frontend; **P1** before soft launch; **P2** can follow.

### P0 — Must complete (frontend)

- [x] **Payment checkout UI** — Pay Now for bills, mess fees, hotel bookings (mock success/fail)
- [x] **Payment result + receipt UI** — txn id, download/print receipt
- [x] **Legal pages** — `/terms`, `/privacy`, `/help`, `/faq`, `/safety` (BD-appropriate content)
- [x] **Route protection** — `RouteAuthGuard` + `AdminAuthGuard` (demo sessionStorage; middleware later)
- [x] **Fix broken links** — footer, login, admin `/admin/bookings`
- [x] **Toast + confirm dialogs** — replace `alert()` / `confirm()` via `FeedbackProvider`, `toast`, `useConfirm`
- [x] **Global error / not-found / loading** — `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, `app/loading.tsx`
- [x] **Session-based identity** — `syncDemoIdentityForRole()` on login; `getDemoTenantId()` reads session (no hardcoded `r1` in pages)

### P1 — Should complete (frontend)

- [x] **Migrate all modules to `lib/api` + `useMockQuery`** — all pages + components; mocks only inside `lib/api/*`
- [x] **Owner subscription plan page + free-tier limit warnings** — `/subscription`, `FreeTierLimitBanner`
- [x] **Featured listing boost purchase UI** — `BoostListingDialog` + `purchaseFeaturedBoost()` (demo checkout)
- [x] **Owner payouts + commission breakdown page** — `/payments` owner panel (`PayoutLedgerTable`, analytics)
- [x] **Cash payment record (owner) with optional receipt photo** — `RecordCashPaymentDialog` on `/bills`
- [x] **Hotel cancellation/refund policy + fee breakdown** — `CancellationPolicyCard`, `BookingFeeBreakdown` on book flow
- [x] **Property (mess/apartment) reviews UI** — `ReviewsSection` on listings; `ReviewCard` on hotels
- [x] **Admin fraud reports page** — `/admin/fraud-reports` via `fetchFraudReports` + `patchFraudReport`
- [x] Full Bangla translations for core flows (search, bills, pay, dashboard)
- [x] Public SEO metadata for listings / hotels
- [x] Currency/date formatting helpers (৳, `bn-BD`)
- [x] **Empty/loading states on every list page** — core list pages (bills, expenses, messages, documents, reports, reminders, + existing)
- [x] **Onboarding wizards for new owners** — `OwnerOnboardingDialog`, `MessOnboardingDialog`, `HotelOnboardingDialog`

### P2 — Nice for production polish

- [ ] Accessibility pass (keyboard, ARIA, contrast)
- [ ] Component/unit tests for billing math + payment flow
- [ ] E2E smoke tests (auth → search → book → pay)
- [ ] PWA manifest
- [ ] Demand heatmap (admin)
- [ ] Property comparison
- [ ] Account recovery UI
- [ ] AI recommendations (proposal later phase)

### Explicitly defer to backend phase (do not block frontend)

- Real OTP/SMS, JWT, server RBAC  
- Real bKash/Nagad/Rocket APIs and webhooks  
- Real file storage (S3/Cloudinary)  
- Realtime chat / push notifications  
- Persisted audit logs, fraud ML, analytics events  
- Flutter mobile app  

---

## 16. Module completion snapshot (frontend UI only)

| Module | UI coverage | Production-ready frontend? |
|--------|-------------|----------------------------|
| 1 Discovery & booking | ~100% UI | **Yes** (mock API); backend for live data/payments |
| 2 Apartment management | ~95% | Yes for demo; minor bill polish |
| 3 Renter app | ~85% | **No** — Pay Now + receipts missing |
| 4 Mess / hostel | ~90% | Almost — pay flow missing |
| 5 Hotel | ~85% | Almost — pay, fees, cancel policy |
| 6 Payments & finance | ~40% | **No** — critical gap |
| 7 Admin & trust | ~80% | Almost — guards, bookings page, fraud UI |
| Monetization | ~20% | **No** |
| Legal / support | ~30% | **No** — broken links |
| Auth / guards | ~50% | **No** — no protection |
| Data layer consistency | ~25% | **No** — mocks scattered |

---

## 17. Suggested frontend completion order (practical)

```text
Week focus 1: P0 payments + receipts + legal pages
Week focus 2: P0 auth guards + toasts + error/not-found + session user id
Week focus 3: P1 lib/api migration (all modules)
Week focus 4: P1 monetization UI + owner payouts + admin gaps
Week focus 5: P1 i18n (core flows) + SEO + empty/loading polish
Week focus 6: P2 a11y + tests + final QA pass
→ Then start backend
```

---

## 18. Definition of “frontend complete”

Frontend is ready to hand off to backend when:

1. Every proposal module has a **complete happy-path UI** (including Pay Now and receipts).  
2. No footer/nav links 404.  
3. Unauthenticated users cannot use private areas; non-admins cannot use admin.  
4. All data access goes through `lib/api` (mocks behind the same interface).  
5. Core flows work in **Bangla and English**.  
6. Payment, booking, and bill flows show clear success/failure states without `alert()`.  
7. Legal pages exist and match login consent copy.  

Backend then only replaces `lib/api/*` implementations and wires real gateways — without redesigning screens.

---

*Generated from full project + requirements review. Update this file as P0/P1 items ship; treat older status docs as historical.*
