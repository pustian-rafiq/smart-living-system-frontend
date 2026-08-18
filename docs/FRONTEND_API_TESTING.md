# Frontend API testing (live Django)

Use this checklist against the running Next.js app and Django API. Data should come from the database (after `seed_all`), not from `data/mock*`.

Swagger (optional): [http://127.0.0.1:8000/api/v1/docs/](http://127.0.0.1:8000/api/v1/docs/)

---

## 0. Before you start

1. API: `cd smart-living-api` then `python manage.py runserver 8000`
2. Seeds (once): `python manage.py seed_all`
3. Frontend: `cd smart-living-system-frontend` then **restart** `npm run dev` after any `next.config.js` change
4. Open **http://localhost:3000** (not a mix of `localhost` and `127.0.0.1` on the same session — cookies are host-specific)

In DevTools → Network, API calls go to **same origin** `/api/v1/.../` (trailing slash). Django POSTs without a slash return **500**.

DEBUG OTP is always **123456**.

| Role | Phone | What you should see after login |
|------|--------|----------------------------------|
| Super admin | `01711111111` | `/admin` dashboard counts |
| Owner | `01712345678` Abdul Karim | Listings, Green Valley mess, buildings, bills, hotels |
| Renter | `01710000001` Rahim Uddin | Favorites, bills, mess student dashboard, chats |

Other seeded renters: `01710000002`–`01710000008`. Other owners: `01712345679`, `01712345680`, `01812345678`, `01912345678`, `01612345678`, `01512345678`.

---

## 1. Auth (must pass first)

The previous 500 on `POST /api/v1/auth/login/start` and `.../token/refresh` was a missing trailing slash. After restarting Next.js, those must be **200** with a JSON envelope `{ ok: true, data: ... }`.

### First-time user (no PIN yet)

- [ ] `/login` → phone `017199988877` (unused) → Continue
- [ ] Network: `POST /api/v1/auth/login/start/` → `next: "otp"`
- [ ] `/otp-verify` auto-fills `123456` in DEBUG → Verify
- [ ] Network: `POST /api/v1/auth/otp/verify/` sets `sl_refresh` + `sl_device` cookies (Application → Cookies → `localhost`)
- [ ] Forced `/set-pin` → 4–6 digit PIN twice → Save
- [ ] `/role-selection` → Renter or Owner → dashboard

### Returning user (PIN already set)

- [ ] Logout from header
- [ ] `/login` → `01710000001` → Continue
- [ ] Network: `login/start/` → `next: "pin"` (no SMS)
- [ ] Enter PIN (if this renter has not set one yet, you get OTP then `/set-pin`)
- [ ] **Forgot PIN** → OTP → `/set-pin` again

### Session restore

- [ ] While logged in, close the tab, reopen `http://localhost:3000`
- [ ] Network: `POST /api/v1/auth/token/refresh/` with cookie → access restored, not bounced to `/login`

### Recover / change phone

- [ ] `/account/recover` → existing phone + OTP → session
- [ ] Logged in → `/account/change-phone` → new BD number + OTP → phone on `/profile` updates

---

## 2. Public (no login)

| Page | APIs | Pass if |
|------|------|---------|
| `/` | `GET /properties/featured/`, `/properties/meta/` | Seeded Dhaka / Chattogram cards, not empty mock stubs |
| `/properties` | `GET /properties/` | ~17 published listings; filters by city/type/rent work |
| `/listings/{id}` | `GET /properties/{id}/`, reviews | Green Valley Mess, Banani Studio, etc. |
| `/hotels` | `GET /hotels/` | Grand Plaza, Cox’s Bazar, Sylhet, Chittagong, Motijheel |
| `/hotels/{id}` | `GET /hotels/{id}/`, rooms, reviews | Rooms and BDT prices |
| `/search` | `GET /properties/` + history if logged in | Results match query |
| `/compare` | `POST /properties/batch/` | Two listings side by side |
| `/health` (API) | `GET http://127.0.0.1:8000/api/v1/health/` | `{ ok: true }` |

---

## 3. Renter (`01710000001`)

After PIN/OTP + role renter:

| Page | APIs | Pass if |
|------|------|---------|
| `/dashboard` | me, bills/mine, bookings/mine | Rahim’s tenancy/bills/bookings, not demo IDs |
| `/profile` | `GET/PATCH /accounts/me/`, `/profile/renter/` | Name/email/photo persist after reload |
| `/favorites` | `GET /favorites/`, toggle | Seeded favorites; heart on listing toggles |
| `/saved-searches` | `/saved-searches/` | “Dhaka mess” style saved search |
| `/search-history` | `/search-history/` | Prior queries; clear works |
| `/rentals` | tenancy/bills | Green Valley / Uttara data if assigned |
| `/bills` | `GET /bills/mine/` | March / current-month bills |
| `/payments` | `/payments/history/`, `/scheduled/` | Seed txn `BKS-SEED-88421`; **do not expect live bKash/Nagad** |
| `/my-bookings` | `/bookings/mine/`, `/hotels/bookings/mine/` | Property + hotel stays |
| `/hotels/{id}/book` | `POST /hotels/{id}/bookings/` | Creates booking; shows in my bookings |
| `/listings/{id}` book | `POST /bookings/` | Pending or instant-approved |
| `/messages` | `/chats/`, `/chats/{id}/messages/` | Thread with Abdul Karim |
| `/notifications` | `/notifications/` | August rent reminder; mark read |
| `/complaints` | `/complaints/` | Water leakage / elevator; create another |
| `/documents` | `/agreements/`, `/checklists/` | Active agreement + move-in checklist |
| `/expenses` | `/expenses/categories/`, budgets, monthly | Categories + budget bars |
| `/reports` | `/reports/expense/`, `/reports/tax/` | Generated report row |
| `/reminders` | `/reminders/`, settings | Due reminders |
| `/notices` | `/notices/` | Mess notices if enrolled |
| `/mess/student-dashboard` | mess students/menus/attendance | Rahim on Green Valley seat A-01 |
| `/mess/student-dashboard/menu` | daily/weekly menus | Today’s Bangla-style meals |
| `/mess/student-dashboard/attendance` | attendance | Recent present/absent |

Profile verification panel: `GET/POST /account/verification/` (NID pending/verified).

---

## 4. Owner (`01712345678`)

Log out, log in as owner (OTP then PIN if asked).

| Page | APIs | Pass if |
|------|------|---------|
| `/dashboard` | snapshot, mine listings | Owner home, not renter widgets |
| `/my-listings` | `GET /properties/mine/` | Green Valley Mess + Mohammadpur mess |
| `/my-listings/new` | `POST /properties/`, `/media/upload/` | New draft → publish → appears on `/properties` |
| `/my-listings/{id}/edit` | `PATCH /properties/{id}/` | Rent/description save |
| `/my-properties` | `/buildings/`, `/portfolio/snapshot/` | Green Valley building, 4 flats |
| `/my-properties/buildings/{id}/flats` | `/buildings/{id}/flats/` | 1A occupied (Rahim), others available |
| Floors / stats | `/floors/{id}/`, `/stats/` | Floor counts |
| `/bills` (owner) | `/bills/board/`, generate | Board by month; generate for a flat |
| `/payments` owner | `/payments/owner/payouts/`, analytics | Payout for seed payment |
| `/subscription` | `/subscriptions/mine/`, plans, boost | Free/Basic/Premium; featured boost options |
| `/my-properties/bookings` | `/bookings/owner/` | Approve/reject pending |
| `/my-hotels` | `/hotels/mine/` | Grand Plaza + Hotel 71 |
| `/my-hotels/new` | `POST /hotels/` | New hotel in `/hotels` |
| `/my-hotels/{id}/rooms` | `/hotels/{id}/rooms/` | Add/edit room |
| `/my-hotels/{id}/pricing` | `/hotels/{id}/pricing/` | Weekend multiplier |
| `/my-hotels/{id}/bookings` | `/hotels/{id}/bookings/` | Guest stays |
| `/mess` | `GET /mess/` | Green Valley Mess |
| `/mess/{id}/meals` | daily/weekly/timing | Edit today’s menu |
| `/mess/{id}/attendance` | attendance + bulk | Mark student present |
| `/mess/{id}/sms` | templates/groups/send | History row (SMS may console-fallback in DEBUG) |
| `/mess/{id}/rules` | rules + violations | Seed rules list |
| `/mess/{id}/expenses` | mess expenses | Food/utilities rows |
| `/messages` | chats | Same thread as renter |
| `/complaints` | owner/admin-visible complaints | Status update if exposed |

Fatima Begum (`01712345679`): Uttara Lake View + Banani Studio. Tanvir (`01512345678`): Cox’s Bazar hotel + Chattogram listings.

---

## 5. Admin (`01711111111`)

`/admin/login` → OTP `123456` (or PIN if set). Demo quick-login buttons still use OTP.

| Page | APIs | Pass if |
|------|------|---------|
| `/admin` | `GET /admin/dashboard/` | User/listing/booking counts > 0 |
| `/admin/users` | `/admin/users/`, `/admin/users/managed/` | Seeded owners/renters |
| `/admin/verifications` | `/admin/verifications/` | Pending NID (e.g. Tania); approve/reject |
| `/admin/properties` | `/admin/properties/moderation/` | Unverified Amberkhana mess can be verified |
| `/admin/bookings` | `/admin/bookings/` | Property bookings list |
| `/admin/complaints` | `/admin/complaints/` | Queue including demo + renter tickets |
| `/admin/disputes` | `/admin/disputes/` | Payment + property disputes |
| `/admin/fraud-reports` | `/admin/fraud-reports/` | Two seed reports; resolve/dismiss |
| `/admin/analytics` | `/admin/analytics/` | Charts/numbers from DB |
| `/admin/settings` | `GET/PUT /admin/settings/` | Platform name/commission persist |
| `/admin/audit-logs` | `/admin/audit-logs/` | Create/verify actions; rollback if `can_rollback` |

Moderator `01722222222` and support `01733333333` should enter `/admin` with reduced actions if the UI hides them.

---

## 6. Payments note

Live bKash / Nagad / SSLCommerz are **not** wired. On `/payments` only wallet/cash/sandbox complete is expected. Gateway buttons may 501 (`GATEWAY_TODO`).

---

## 7. Network sanity (every session)

- [ ] Requests are `/api/v1/.../` **with** trailing slash (proxied, not CORS errors to `:8000`)
- [ ] Envelope: `{ "ok": true, "data": ... }` or `{ "ok": false, "error": "...", "code": "..." }`
- [ ] After 15 minutes idle, a 401 is followed by `POST /auth/token/refresh/` then the original request retries
- [ ] Logout → `POST /auth/logout/` → refresh cookie gone; reopen tab stays logged out
- [ ] Uploads (`/media/upload/`) return an `https://...digitaloceanspaces.com/...` URL, not `blob:`

---

## 8. If something fails

| Symptom | Check |
|---------|--------|
| 500 on login/refresh | Restart `npm run dev`. URL must end with `/`. |
| Empty `/properties` | `python manage.py seed_all`; API on port 8000 |
| Always `/login` after refresh | Use `localhost` for both UI and (proxied) API; cookie `sl_refresh` present |
| SMS error in API log | DEBUG still issues OTP `123456` |
| Wrong person on renter bills | Must be `01710000001`, not the admin `01711111111` |
| Admin 403 | Phone must have `AdminProfile`; re-run `seed_demo_admins` |
