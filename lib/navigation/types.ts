import type { LucideIcon } from 'lucide-react'
import type { UserRole } from '@/types'

export interface NavChildItem {
  label: string
  href: string
  description?: string
}

export interface NavItem {
  label: string
  /** Direct link — omit when using children */
  href?: string
  icon?: LucideIcon
  children?: NavChildItem[]
  /** Extra path prefixes that mark this item active (e.g. nested routes) */
  matchPrefixes?: string[]
  roles: UserRole[]
}

export interface BottomNavItem {
  label: string
  href?: string
  icon: LucideIcon
  matchPrefixes?: string[]
  roles: UserRole[]
  /** Opens the full mobile menu drawer instead of navigating */
  action?: 'menu'
}

export interface QuickActionItem {
  label: string
  href: string
  description?: string
  roles: UserRole[]
}

export interface MobileUtilityLink {
  label: string
  href: string
  icon: LucideIcon
  roles: UserRole[]
}
