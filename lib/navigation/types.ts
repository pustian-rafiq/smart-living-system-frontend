import type { LucideIcon } from 'lucide-react'
import type { UserRole } from '@/types'
import type { OwnerVertical } from '@/lib/owner-focus'

export interface NavChildItem {
  labelKey: string
  href: string
  descriptionKey?: string
  /** When set, only show for owners who enabled this vertical. */
  ownerVertical?: OwnerVertical
}

export interface NavItem {
  labelKey: string
  href?: string
  icon?: LucideIcon
  children?: NavChildItem[]
  matchPrefixes?: string[]
  roles: UserRole[]
  /** When set, only show for owners who enabled this vertical. */
  ownerVertical?: OwnerVertical
}

export interface BottomNavItem {
  labelKey: string
  href?: string
  icon: LucideIcon
  matchPrefixes?: string[]
  roles: UserRole[]
  action?: 'menu'
  ownerVertical?: OwnerVertical
}

export interface QuickActionItem {
  labelKey: string
  href: string
  descriptionKey?: string
  roles: UserRole[]
  ownerVertical?: OwnerVertical
}

export interface MobileUtilityLink {
  labelKey: string
  href: string
  icon: LucideIcon
  roles: UserRole[]
}
