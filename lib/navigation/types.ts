import type { LucideIcon } from 'lucide-react'
import type { UserRole } from '@/types'

export interface NavChildItem {
  labelKey: string
  href: string
  descriptionKey?: string
}

export interface NavItem {
  labelKey: string
  href?: string
  icon?: LucideIcon
  children?: NavChildItem[]
  matchPrefixes?: string[]
  roles: UserRole[]
}

export interface BottomNavItem {
  labelKey: string
  href?: string
  icon: LucideIcon
  matchPrefixes?: string[]
  roles: UserRole[]
  action?: 'menu'
}

export interface QuickActionItem {
  labelKey: string
  href: string
  descriptionKey?: string
  roles: UserRole[]
}

export interface MobileUtilityLink {
  labelKey: string
  href: string
  icon: LucideIcon
  roles: UserRole[]
}
