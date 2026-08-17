# Backend Implementation Audit

**Scope:** `BACKEND_DESIGN.md` §§6–18 (lines 203–1017)  
**Updated:** 2026-07-11  
**Verdict:** §9 API surface is **complete**. Phases 1–9 product gaps from the prior audit are implemented. Remaining items are production ops (CI/CD, webhook load tests, WebSockets, guardian) — optional / future.

---

## Summary

| Area | Status |
|------|--------|
| Auth & accounts (§7, §9.1) | Complete |
| Listings & discovery (§8.2, §9.2, §9.11) | Complete |
| Portfolio & billing (§8.3–8.4, §9.3, §9.5) | Complete (incl. renter history) |
| Payments (§8.5, §9.6, §11) | Complete (sandbox; real credentials later) |
| Bookings & hotels (§8.7–8.8, §9.4, §9.8) | Complete |
| Mess (§8.6, §9.7) | Complete |
| Messaging & support (§8.9, §9.9) | Complete |
| Documents / reports / reminders | Complete |
| Admin & monetization | Complete + fine-grained `admin_permission` on ban/settings |
| Hardening (§12–17 / Phase 9) | Configurable — see env toggles below |
| Frontend `lib/api` | Complete for §9 surface |

---

## Completed (this pass)

| Item | Backend | Frontend |
|------|---------|----------|
| `GET /api/v1/renters/{id}/history/` | `portfolio.views.RenterHistoryView` | `lib/api/profile.ts` → `fetchRenterHistory` |
| Rentals summaries | Uses `/bookings/mine/` | `lib/api/rentals.ts` |
| Celery overdue + reminders | `billing.tasks`, `reports.tasks` | — |
| Rate limits | DRF throttles + OTP cache limit | — |
| `HasAdminPermission` / role ACL | `admin_api.permissions` | — |
| `mockDelay` | — | No-op unless `NEXT_PUBLIC_USE_MOCK_DELAY=true` |

### Dev vs production toggles (`smart-living-api/.env`)

| Variable | Dev (default) | Production intent | Effect |
|----------|---------------|-------------------|--------|
| `CELERY_TASK_ALWAYS_EAGER` | `true` | `false` | Eager = in-process tasks, **no Redis/broker** |
| `CELERY_BEAT_ENABLED` | `false` | `true` | Periodic overdue + reminder schedule |
| `USE_REDIS_CACHE` | `false` | `true` | LocMem vs Redis (avoids hang if Redis down) |
| `API_THROTTLING_ENABLED` | `false` | `true` | DRF anon/user/OTP throttles |
| `OTP_RATE_LIMIT_ENABLED` | `true` | `true` | Cache OTP request cap (5/hour) |
| `PAYMENT_SANDBOX_AUTO_COMPLETE` | `true` | `false` | Auto-complete wallet pays without gateway |

Manual job run (works in eager mode):

```bash
python manage.py run_hardening_tasks
```

Production workers (when ready):

```bash
# .env: CELERY_TASK_ALWAYS_EAGER=false USE_REDIS_CACHE=true CELERY_BEAT_ENABLED=true API_THROTTLING_ENABLED=true
celery -A config worker -l info
celery -A config beat -l info
```

---

## Still deferred (optional / future)

| Item | Notes |
|------|-------|
| WebSockets / Channels | Realtime chat/notifications — polling unread for now |
| django-guardian | Object perms; ownership checks in views instead |
| Server PDF invoices | Client download helpers only |
| Live payment gateway HTTP | Stubs until credentials filled |
| Sentry / metrics | Logging console only |
| httpOnly refresh cookie | Tokens in sessionStorage |
| CI/CD + webhook load tests | Ops |
| Owner ratings/references in history | API returns empty arrays until models exist |

---

## API testing — renter history & rentals

**Frontend paths:** `/profile` (History tab), `/rentals`, owner flat → Renter history dialog  
**API:** `GET /api/v1/renters/{id}/history/` · rentals UI → `GET /api/v1/bookings/mine/`

Demo renter: `+8801710000001` / OTP `123456`

1. Login at `/login` as renter  
2. Open `/profile` → History tab (live API)  
3. Open `/rentals` (live bookings)  
4. As owner, open occupied flat → View renter history  

```bash
# After OTP verify, with ACCESS + USER_ID:
curl -s "http://127.0.0.1:8000/api/v1/renters/$USER_ID/history/" \
  -H "Authorization: Bearer $ACCESS"
```

See full module matrix earlier in this file’s previous revision / `BACKEND_DESIGN.md` §9.

---

## Verdict

**Missing §9 endpoints:** none.  
**Frontend mocks for history/rentals:** removed.  
**Phase 9 hardening:** implemented behind env flags so local/dev does not hang; production can enable Redis, Celery workers, beat, and throttles when you want.
