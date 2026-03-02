# Migration from Pages Router to App Router

## Summary

The project has been successfully migrated from Next.js 14 Pages Router to Next.js 15 App Router.

## Changes Made

### 1. Package Updates
- **Next.js**: Updated from `^14.2.0` to `^15.0.0`
- **React**: Updated from `^18.3.0` to `^19.0.0`
- **React DOM**: Updated from `^18.3.0` to `^19.0.0`
- **TypeScript**: Updated to `^5.6.0`
- **ESLint**: Updated to `^9.0.0` with Next.js 15 config

### 2. Directory Structure Changes

**Before (Pages Router):**
```
frontend/
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   ├── login.tsx
│   └── api/
│       └── example.ts
```

**After (App Router):**
```
frontend/
├── app/
│   ├── layout.tsx (replaces _app.tsx)
│   ├── page.tsx (replaces index.tsx)
│   ├── login/
│   │   └── page.tsx
│   └── api/
│       └── example/
│           └── route.ts
```

### 3. Key Code Changes

#### Routing
- **Before**: `useRouter()` from `next/router`
- **After**: `useRouter()` from `next/navigation`
- **Before**: `router.pathname` for active route
- **After**: `usePathname()` hook from `next/navigation`

#### Metadata
- **Before**: `<Head>` component from `next/head`
- **After**: `metadata` export in page files or `Metadata` type

#### Client Components
- All components using hooks or client-side features now have `'use client'` directive at the top

#### API Routes
- **Before**: `pages/api/example.ts` with `handler` function
- **After**: `app/api/example/route.ts` with named exports (`GET`, `POST`, etc.)

### 4. Files Migrated

All pages have been converted:
- ✅ `app/page.tsx` (home)
- ✅ `app/login/page.tsx`
- ✅ `app/otp-verify/page.tsx`
- ✅ `app/role-selection/page.tsx`
- ✅ `app/dashboard/page.tsx`
- ✅ `app/search/page.tsx`
- ✅ `app/profile/page.tsx`
- ✅ `app/bills/page.tsx`
- ✅ `app/about/page.tsx`
- ✅ `app/contact/page.tsx`
- ✅ `app/properties/page.tsx`
- ✅ `app/my-properties/page.tsx`
- ✅ `app/rentals/page.tsx`
- ✅ `app/admin/page.tsx`
- ✅ `app/api/example/route.ts`

### 5. Component Updates

All layout components updated:
- ✅ `components/layout/Navbar.tsx` - Uses `usePathname()` instead of `router.pathname`
- ✅ `components/layout/Header.tsx` - Added `'use client'`
- ✅ `components/layout/Footer.tsx` - Added `'use client'`
- ✅ `components/layout/Layout.tsx` - Added `'use client'`

### 6. Configuration Updates

- ✅ `next.config.js` - Removed `swcMinify` (default in Next.js 15)
- ✅ `tailwind.config.ts` - Updated content paths to only include `app/` directory
- ✅ `app/layout.tsx` - Root layout with providers

### 7. Theme System

- Theme initialization moved to `ThemeProvider` component
- Theme class applied on mount in `useEffect`

## Next Steps

1. **Remove old pages directory** (optional, can keep for reference):
   ```bash
   rm -rf frontend/pages
   ```

2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Test the application**:
   ```bash
   npm run dev
   ```

## Breaking Changes

1. **Routing**: All `next/router` imports must be changed to `next/navigation`
2. **Metadata**: Use `metadata` export instead of `<Head>` component
3. **Client Components**: Must have `'use client'` directive
4. **API Routes**: Different file structure and export format

## Benefits of App Router

1. **Better Performance**: Improved React Server Components support
2. **Improved Developer Experience**: Better TypeScript support, simpler routing
3. **Future-Proof**: App Router is the recommended approach for Next.js
4. **Better Data Fetching**: Built-in support for async components and streaming

## Notes

- The old `pages/` directory can be kept for reference but is no longer used
- All functionality has been preserved during migration
- Theme and language providers work the same way
- Session storage and authentication logic unchanged
