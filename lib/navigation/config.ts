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

export const primaryNavItems: NavItem[] = [
  {
    labelKey: 'primary.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['renter', 'owner', 'admin'],
  },
  {
    labelKey: 'primary.discover',
    icon: Search,
    roles: ['renter'],
    matchPrefixes: ['/search', '/properties', '/hotels', '/listings', '/favorites', '/messes', '/roommates', '/areas', '/university'],
    children: [
      {
        labelKey: 'children.search',
        href: '/search',
        descriptionKey: 'children.searchDesc',
      },
      {
        labelKey: 'children.browseListings',
        href: '/properties',
        descriptionKey: 'children.browseListingsDesc',
      },
      {
        labelKey: 'children.browseMess',
        href: '/messes',
        descriptionKey: 'children.browseMessDesc',
      },
      {
        labelKey: 'children.hotelsStays',
        href: '/hotels',
        descriptionKey: 'children.hotelsStaysDesc',
      },
      {
        labelKey: 'children.findRoommates',
        href: '/roommates',
      },
      {
        labelKey: 'children.compareAreas',
        href: '/areas/compare',
      },
      {
        labelKey: 'children.universities',
        href: '/university',
      },
      {
        labelKey: 'children.areasSeo',
        href: '/areas',
      },
    ],
  },
  {
    labelKey: 'primary.myLiving',
    icon: Home,
    roles: ['renter'],
    matchPrefixes: ['/rentals', '/mess/student-dashboard', '/mess'],
    children: [
      {
        labelKey: 'children.myRentals',
        href: '/rentals',
        descriptionKey: 'children.myRentalsDesc',
      },
      {
        labelKey: 'children.myMess',
        href: '/mess/student-dashboard',
        descriptionKey: 'children.myMessDesc',
      },
    ],
  },
  {
    labelKey: 'primary.finance',
    icon: Wallet,
    roles: ['renter'],
    matchPrefixes: ['/bills', '/payments'],
    children: [
      {
        labelKey: 'children.bills',
        href: '/bills',
        descriptionKey: 'children.billsDesc',
      },
      {
        labelKey: 'children.payments',
        href: '/payments',
        descriptionKey: 'children.paymentsDesc',
      },
    ],
  },
  {
    labelKey: 'primary.bookings',
    href: '/my-bookings',
    icon: CalendarCheck,
    roles: ['renter'],
    matchPrefixes: ['/my-bookings'],
  },
  {
    labelKey: 'primary.more',
    icon: MoreHorizontal,
    roles: ['renter'],
    matchPrefixes: ['/compare', '/complaints', '/documents', '/reminders', '/roommates', '/areas'],
    children: [
      { labelKey: 'children.compareListings', href: '/compare' },
      { labelKey: 'children.compareAreas', href: '/areas/compare' },
      { labelKey: 'children.findRoommates', href: '/roommates' },
      { labelKey: 'children.complaints', href: '/complaints' },
      { labelKey: 'children.documents', href: '/documents' },
      { labelKey: 'children.reminders', href: '/reminders' },
    ],
  },
  {
    labelKey: 'primary.properties',
    icon: Building2,
    roles: ['owner'],
    matchPrefixes: ['/my-properties', '/my-listings', '/listings'],
    children: [
      {
        labelKey: 'children.myBuildings',
        href: '/my-properties',
        descriptionKey: 'children.myBuildingsDesc',
      },
      {
        labelKey: 'children.bookingRequests',
        href: '/my-properties/bookings',
        descriptionKey: 'children.bookingRequestsDesc',
      },
      {
        labelKey: 'children.myListings',
        href: '/my-listings',
        descriptionKey: 'children.myListingsDesc',
      },
    ],
  },
  {
    labelKey: 'primary.myHotels',
    icon: Hotel,
    roles: ['owner'],
    matchPrefixes: ['/my-hotels'],
    children: [
      {
        labelKey: 'children.allHotels',
        href: '/my-hotels',
        descriptionKey: 'children.allHotelsDesc',
      },
      {
        labelKey: 'children.registerHotel',
        href: '/my-hotels/new',
        descriptionKey: 'children.registerHotelDesc',
      },
      {
        labelKey: 'children.browseMarketplace',
        href: '/hotels',
        descriptionKey: 'children.browseMarketplaceDesc',
      },
    ],
  },
  {
    labelKey: 'primary.messHostel',
    href: '/mess',
    icon: UtensilsCrossed,
    roles: ['owner'],
    matchPrefixes: ['/mess'],
  },
  {
    labelKey: 'primary.finance',
    icon: Wallet,
    roles: ['owner'],
    matchPrefixes: ['/bills', '/payments', '/reports', '/expenses', '/subscription'],
    children: [
      {
        labelKey: 'children.generateRent',
        href: '/bills?mode=generate',
        descriptionKey: 'children.generateRentDesc',
      },
      {
        labelKey: 'children.bills',
        href: '/bills',
        descriptionKey: 'children.billsDesc',
      },
      {
        labelKey: 'children.payments',
        href: '/payments',
        descriptionKey: 'children.paymentsDesc',
      },
      {
        labelKey: 'children.subscription',
        href: '/subscription',
        descriptionKey: 'children.subscriptionDesc',
      },
      { labelKey: 'children.reports', href: '/reports' },
      { labelKey: 'children.expenses', href: '/expenses' },
    ],
  },
  {
    labelKey: 'primary.communicate',
    icon: MessageSquare,
    roles: ['owner'],
    matchPrefixes: ['/notices', '/messages'],
    children: [
      {
        labelKey: 'children.notices',
        href: '/notices',
        descriptionKey: 'children.noticesDesc',
      },
      {
        labelKey: 'children.messages',
        href: '/messages',
        descriptionKey: 'children.messagesDesc',
      },
    ],
  },
  {
    labelKey: 'primary.more',
    icon: MoreHorizontal,
    roles: ['owner'],
    matchPrefixes: ['/documents', '/complaints'],
    children: [
      { labelKey: 'children.documents', href: '/documents' },
      { labelKey: 'children.complaints', href: '/complaints' },
    ],
  },
  {
    labelKey: 'primary.admin',
    href: '/admin',
    icon: Building2,
    roles: ['admin'],
    matchPrefixes: ['/admin'],
  },
]

export const bottomNavItems: BottomNavItem[] = [
  {
    labelKey: 'bottom.home',
    href: '/dashboard',
    icon: LayoutDashboard,
    matchPrefixes: ['/dashboard'],
    roles: ['renter'],
  },
  {
    labelKey: 'bottom.discover',
    href: '/search',
    icon: Search,
    matchPrefixes: ['/search', '/properties', '/hotels', '/listings'],
    roles: ['renter'],
  },
  {
    labelKey: 'bottom.bills',
    href: '/bills',
    icon: FileText,
    matchPrefixes: ['/bills', '/payments'],
    roles: ['renter'],
  },
  {
    labelKey: 'bottom.bookings',
    href: '/my-bookings',
    icon: CalendarCheck,
    matchPrefixes: ['/my-bookings'],
    roles: ['renter'],
  },
  {
    labelKey: 'bottom.menu',
    icon: Menu,
    action: 'menu',
    roles: ['renter'],
  },
  {
    labelKey: 'bottom.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    matchPrefixes: ['/dashboard'],
    roles: ['owner'],
  },
  {
    labelKey: 'bottom.properties',
    href: '/my-properties',
    icon: Building2,
    matchPrefixes: ['/my-properties', '/my-listings', '/my-properties/bookings'],
    roles: ['owner'],
  },
  {
    labelKey: 'bottom.hotels',
    href: '/my-hotels',
    icon: Hotel,
    matchPrefixes: ['/my-hotels'],
    roles: ['owner'],
  },
  {
    labelKey: 'bottom.mess',
    href: '/mess',
    icon: UtensilsCrossed,
    matchPrefixes: ['/mess'],
    roles: ['owner'],
  },
  {
    labelKey: 'bottom.menu',
    icon: Menu,
    action: 'menu',
    roles: ['owner'],
  },
  {
    labelKey: 'bottom.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    matchPrefixes: ['/dashboard'],
    roles: ['admin'],
  },
  {
    labelKey: 'bottom.admin',
    href: '/admin',
    icon: Building2,
    matchPrefixes: ['/admin'],
    roles: ['admin'],
  },
  {
    labelKey: 'bottom.notices',
    href: '/notices',
    icon: Bell,
    matchPrefixes: ['/notices'],
    roles: ['admin'],
  },
  {
    labelKey: 'bottom.menu',
    icon: Menu,
    action: 'menu',
    roles: ['admin'],
  },
]

export const quickActionItems: QuickActionItem[] = [
  {
    labelKey: 'quickActions.addBuilding',
    href: '/my-properties',
    descriptionKey: 'quickActions.addBuildingDesc',
    roles: ['owner'],
  },
  {
    labelKey: 'quickActions.registerHotel',
    href: '/my-hotels/new',
    descriptionKey: 'quickActions.registerHotelDesc',
    roles: ['owner'],
  },
  {
    labelKey: 'quickActions.publishListing',
    href: '/my-listings/new',
    descriptionKey: 'quickActions.publishListingDesc',
    roles: ['owner'],
  },
  {
    labelKey: 'quickActions.createNotice',
    href: '/notices',
    descriptionKey: 'quickActions.createNoticeDesc',
    roles: ['owner'],
  },
]

export const mobileUtilityLinks: MobileUtilityLink[] = [
  {
    labelKey: 'utility.messages',
    href: '/messages',
    icon: MessageCircle,
    roles: ['renter', 'owner', 'admin'],
  },
  {
    labelKey: 'utility.favorites',
    href: '/favorites',
    icon: Heart,
    roles: ['renter'],
  },
  {
    labelKey: 'utility.searchHistory',
    href: '/search-history',
    icon: Clock,
    roles: ['renter'],
  },
  {
    labelKey: 'utility.savedSearches',
    href: '/saved-searches',
    icon: Bookmark,
    roles: ['renter'],
  },
  {
    labelKey: 'utility.notices',
    href: '/notices',
    icon: Bell,
    roles: ['owner', 'admin'],
  },
  {
    labelKey: 'utility.profile',
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

export const quickActionTriggerIcon = Plus
