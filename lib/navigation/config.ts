import {
  LayoutDashboard,
  Search,
  Building2,
  Hotel,
  UtensilsCrossed,
  Wallet,
  CalendarCheck,
  MoreHorizontal,
  Home,
  FileText,
  User,
  MessageSquare,
  Bell,
  Plus,
  Heart,
  Clock,
  Bookmark,
  MessageCircle,
  Menu,
} from 'lucide-react'
import type { UserRole } from '@/types'
import type {
  BottomNavItem,
  MobileUtilityLink,
  NavItem,
  QuickActionItem,
} from './types'

/** Desktop secondary header — grouped primary navigation */
export const primaryNavItems: NavItem[] = [
  // ── Shared ──────────────────────────────────────────────────────────────
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['renter', 'owner', 'admin'],
  },

  // ── Renter ──────────────────────────────────────────────────────────────
  {
    label: 'Discover',
    icon: Search,
    roles: ['renter'],
    matchPrefixes: ['/search', '/properties', '/hotels', '/listings', '/favorites'],
    children: [
      {
        label: 'Search',
        href: '/search',
        description: 'Filter apartments, mess, and hostels',
      },
      {
        label: 'Browse listings',
        href: '/properties',
        description: 'Featured verified listings',
      },
      {
        label: 'Hotels & stays',
        href: '/hotels',
        description: 'Book hotels and guest houses',
      },
    ],
  },
  {
    label: 'My Living',
    icon: Home,
    roles: ['renter'],
    matchPrefixes: ['/rentals', '/mess/student-dashboard', '/mess'],
    children: [
      {
        label: 'My rentals',
        href: '/rentals',
        description: 'Active and past tenancies',
      },
      {
        label: 'My mess',
        href: '/mess/student-dashboard',
        description: 'Seat, meals, and attendance',
      },
    ],
  },
  {
    label: 'Finance',
    icon: Wallet,
    roles: ['renter'],
    matchPrefixes: ['/bills', '/payments'],
    children: [
      {
        label: 'Bills',
        href: '/bills',
        description: 'View and pay rent invoices',
      },
      {
        label: 'Payments',
        href: '/payments',
        description: 'History and scheduled payments',
      },
    ],
  },
  {
    label: 'Bookings',
    href: '/my-bookings',
    icon: CalendarCheck,
    roles: ['renter'],
    matchPrefixes: ['/my-bookings'],
  },
  {
    label: 'More',
    icon: MoreHorizontal,
    roles: ['renter'],
    matchPrefixes: ['/compare', '/complaints', '/documents', '/reminders'],
    children: [
      { label: 'Compare listings', href: '/compare' },
      { label: 'Complaints', href: '/complaints' },
      { label: 'Documents', href: '/documents' },
      { label: 'Reminders', href: '/reminders' },
    ],
  },

  // ── Owner ───────────────────────────────────────────────────────────────
  {
    label: 'Properties',
    icon: Building2,
    roles: ['owner'],
    matchPrefixes: [
      '/my-properties',
      '/my-listings',
      '/listings',
    ],
    children: [
      {
        label: 'My buildings',
        href: '/my-properties',
        description: 'Buildings, floors, and flats',
      },
      {
        label: 'Booking requests',
        href: '/my-properties/bookings',
        description: 'Approve or reject renters',
      },
      {
        label: 'My listings',
        href: '/my-listings',
        description: 'Marketplace listings you publish',
      },
    ],
  },
  {
    label: 'My Hotels',
    icon: Hotel,
    roles: ['owner'],
    matchPrefixes: ['/my-hotels'],
    children: [
      {
        label: 'All hotels',
        href: '/my-hotels',
        description: 'Manage properties and bookings',
      },
      {
        label: 'Register hotel',
        href: '/my-hotels/new',
        description: 'Onboard a new guest house or hotel',
      },
      {
        label: 'Browse marketplace',
        href: '/hotels',
        description: 'Preview how guests discover stays',
      },
    ],
  },
  {
    label: 'Mess & Hostel',
    href: '/mess',
    icon: UtensilsCrossed,
    roles: ['owner'],
    matchPrefixes: ['/mess'],
  },
  {
    label: 'Finance',
    icon: Wallet,
    roles: ['owner'],
    matchPrefixes: ['/bills', '/payments', '/reports', '/expenses'],
    children: [
      {
        label: 'Generate rent',
        href: '/bills?mode=generate',
        description: 'Create monthly rent slips',
      },
      {
        label: 'Bills',
        href: '/bills',
        description: 'Track and collect payments',
      },
      {
        label: 'Payments',
        href: '/payments',
        description: 'Payment history and schedules',
      },
      { label: 'Reports', href: '/reports' },
      { label: 'Expenses', href: '/expenses' },
    ],
  },
  {
    label: 'Communicate',
    icon: MessageSquare,
    roles: ['owner'],
    matchPrefixes: ['/notices', '/messages'],
    children: [
      {
        label: 'Notices',
        href: '/notices',
        description: 'Announcements for tenants',
      },
      {
        label: 'Messages',
        href: '/messages',
        description: 'Chat with renters',
      },
    ],
  },
  {
    label: 'More',
    icon: MoreHorizontal,
    roles: ['owner'],
    matchPrefixes: ['/documents', '/complaints'],
    children: [
      { label: 'Documents', href: '/documents' },
      { label: 'Complaints', href: '/complaints' },
    ],
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  {
    label: 'Admin',
    href: '/admin',
    icon: Building2,
    roles: ['admin'],
    matchPrefixes: ['/admin'],
  },
]

/** Mobile bottom bar — aligned with desktop groups (max 5 tabs) */
export const bottomNavItems: BottomNavItem[] = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: LayoutDashboard,
    matchPrefixes: ['/dashboard'],
    roles: ['renter'],
  },
  {
    label: 'Discover',
    href: '/search',
    icon: Search,
    matchPrefixes: ['/search', '/properties', '/hotels', '/listings'],
    roles: ['renter'],
  },
  {
    label: 'Bills',
    href: '/bills',
    icon: FileText,
    matchPrefixes: ['/bills', '/payments'],
    roles: ['renter'],
  },
  {
    label: 'Bookings',
    href: '/my-bookings',
    icon: CalendarCheck,
    matchPrefixes: ['/my-bookings'],
    roles: ['renter'],
  },
  {
    label: 'Menu',
    icon: Menu,
    action: 'menu',
    roles: ['renter'],
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    matchPrefixes: ['/dashboard'],
    roles: ['owner'],
  },
  {
    label: 'Properties',
    href: '/my-properties',
    icon: Building2,
    matchPrefixes: ['/my-properties', '/my-listings', '/my-properties/bookings'],
    roles: ['owner'],
  },
  {
    label: 'Hotels',
    href: '/my-hotels',
    icon: Hotel,
    matchPrefixes: ['/my-hotels'],
    roles: ['owner'],
  },
  {
    label: 'Mess',
    href: '/mess',
    icon: UtensilsCrossed,
    matchPrefixes: ['/mess'],
    roles: ['owner'],
  },
  {
    label: 'Menu',
    icon: Menu,
    action: 'menu',
    roles: ['owner'],
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    matchPrefixes: ['/dashboard'],
    roles: ['admin'],
  },
  {
    label: 'Admin',
    href: '/admin',
    icon: Building2,
    matchPrefixes: ['/admin'],
    roles: ['admin'],
  },
  {
    label: 'Notices',
    href: '/notices',
    icon: Bell,
    matchPrefixes: ['/notices'],
    roles: ['admin'],
  },
  {
    label: 'Menu',
    icon: Menu,
    action: 'menu',
    roles: ['admin'],
  },
]

/** Owner quick-create actions (desktop header, right side) */
export const quickActionItems: QuickActionItem[] = [
  {
    label: 'Add building',
    href: '/my-properties',
    description: 'Create a building and manage flats',
    roles: ['owner'],
  },
  {
    label: 'Register hotel',
    href: '/my-hotels/new',
    description: 'Onboard a hotel or guest house',
    roles: ['owner'],
  },
  {
    label: 'Publish listing',
    href: '/my-listings/new',
    description: 'Appear in search and discovery',
    roles: ['owner'],
  },
  {
    label: 'Create notice',
    href: '/notices',
    description: 'Send announcements to tenants',
    roles: ['owner'],
  },
]

/** Header shortcuts surfaced inside the mobile drawer */
export const mobileUtilityLinks: MobileUtilityLink[] = [
  {
    label: 'Messages',
    href: '/messages',
    icon: MessageCircle,
    roles: ['renter', 'owner', 'admin'],
  },
  {
    label: 'Favorites',
    href: '/favorites',
    icon: Heart,
    roles: ['renter'],
  },
  {
    label: 'Search history',
    href: '/search-history',
    icon: Clock,
    roles: ['renter'],
  },
  {
    label: 'Saved searches',
    href: '/saved-searches',
    icon: Bookmark,
    roles: ['renter'],
  },
  {
    label: 'Notices',
    href: '/notices',
    icon: Bell,
    roles: ['owner', 'admin'],
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    roles: ['renter', 'owner', 'admin'],
  },
]

export function getMobileUtilityLinksForRole(role: UserRole): MobileUtilityLink[] {
  return mobileUtilityLinks.filter(item => item.roles.includes(role))
}

export function getPrimaryNavForRole(role: UserRole): NavItem[] {
  return primaryNavItems.filter(item => item.roles.includes(role))
}

export function getBottomNavForRole(role: UserRole): BottomNavItem[] {
  return bottomNavItems.filter(item => item.roles.includes(role))
}

export function getQuickActionsForRole(role: UserRole): QuickActionItem[] {
  return quickActionItems.filter(item => item.roles.includes(role))
}

/** Icon used for the owner "+ New" trigger */
export const quickActionTriggerIcon = Plus
