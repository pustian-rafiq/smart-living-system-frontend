# Smart Living Ecosystem — Frontend Structure

This project is a **Next.js 15 (App Router)** frontend. Business data is loaded through a **mock API layer** (`lib/api/`) so routes can switch to real HTTP clients later without rewriting UI logic.

## Top-level layout

```
├── app/                    # Routes (App Router): pages, layouts, route groups
├── components/             # UI: layout, feature modules, shadcn/ui
├── components/page/        # Shared page chrome: PageHeader, PageContainer, EmptyState, LoadingState
├── data/                   # Mock datasets + in-memory mutators (dev/demo)
├── hooks/                  # e.g. useMockQuery — async mock API + loading state
├── lib/
│   ├── api/                # Mock “API”: typed async functions, ApiResult<T>, delays
│   └── utils.ts            # cn() and helpers
├── styles/globals.css      # Design tokens + Tailwind
├── types/                  # Shared TypeScript types
└── utils/                  # auth helpers, theme, api client shell (real backend later)
```

## App routes (`app/`)

| Area | Paths |
|------|--------|
| Public / marketing | `/`, `/about`, `/contact` |
| Discovery | `/search`, `/properties` (featured browse), `/hotels`, `/hotels/[hotelId]`, `/hotels/[hotelId]/book` |
| Auth (demo) | `/login`, `/otp-verify`, `/role-selection` |
| Renter | `/dashboard`, `/rentals`, `/bills`, `/payments`, `/favorites`, `/saved-searches`, `/search-history`, `/messages`, `/complaints`, `/documents`, `/expenses`, `/reports`, `/reminders`, `/notifications`, `/profile` |
| Owner | `/my-properties`, buildings/floors/flats, `/my-properties/bookings` |
| Hotels (owner) | `/my-hotels`, `/my-hotels/[hotelId]/rooms`, `.../calendar`, `.../bookings` |
| Mess | `/mess`, `/mess/[messId]/*`, `/mess/student-dashboard/*` |
| Bookings | `/my-bookings` |
| Admin | `/admin`, `/admin/users`, `.../properties`, `.../complaints`, etc. |

## Mock API (`lib/api/`)

- **`http.ts`** — `mockDelay`, `ApiResult<T>`, `ok` / `err`
- **`demoUser.ts`** — demo renter id (sessionStorage hook for later auth)
- **`properties.ts`** — `fetchProperties`, `fetchFeaturedProperties`, …
- **`bookings.ts`** — renter/owner booking queries and status updates
- **`rentals.ts`** — renter rental summaries (classifies booking phase)

Pages should prefer **`useMockQuery(() => someApiCall())`** (with a stable `useCallback` fetcher) over importing `mock*` directly, for consistency and easier backend swap.

## Design consistency

- **Layout**: `Layout` wraps most pages; `AppHeader`, `Navbar` (desktop), `BottomNavigation` (mobile)
- **Spacing**: `PageContainer` + `PageHeader` for title/description/actions
- **Empty / loading**: `EmptyState`, `LoadingState`
- **Theming**: `ThemeProvider`, Tailwind + CSS variables in `globals.css`

## Scripts

```bash
npm install
npm run dev          # development
npm run build        # production (see next.config.js: ESLint + TS settings)
npm run lint         # ESLint
```

`next.config.js` may set `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` until remaining Zod v4 / resolver typings are cleaned up project-wide. Run `npx tsc --noEmit` locally when tightening types.

## Backend (later)

Replace `lib/api/*` implementations with `fetch`/`api` calls to your FastAPI/Nest service; keep the same function names and `ApiResult` shape where possible.
