'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  getPrimaryNavForRole,
  getQuickActionsForRole,
  isChildActive,
  isNavItemActive,
} from '@/lib/navigation'
import type { NavItem } from '@/lib/navigation'
import type { UserRole } from '@/types'

interface NavbarProps {
  userRole?: UserRole
}

function navTriggerClass(active: boolean) {
  return cn(
    'inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium transition-colors',
    active
      ? 'bg-primary/10 text-primary'
      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
  )
}

function NavLinkItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isNavItemActive(pathname, item)

  if (!item.href) return null

  return (
    <Link href={item.href} className={navTriggerClass(active)}>
      {item.label}
    </Link>
  )
}

function NavDropdownItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isNavItemActive(pathname, item)

  if (!item.children?.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(navTriggerClass(active), 'outline-none')}>
        {item.label}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {item.children.map(child => (
          <DropdownMenuItem key={child.href} asChild>
            <Link
              href={child.href}
              className={cn(
                'flex cursor-pointer flex-col items-start gap-0.5',
                isChildActive(pathname, child) && 'bg-accent'
              )}
            >
              <span className="font-medium">{child.label}</span>
              {child.description && (
                <span className="text-xs text-muted-foreground">
                  {child.description}
                </span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function QuickActionsMenu({ role }: { role: UserRole }) {
  const actions = getQuickActionsForRole(role)
  if (actions.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map(action => (
          <DropdownMenuItem key={action.href} asChild>
            <Link
              href={action.href}
              className="flex cursor-pointer flex-col items-start gap-0.5"
            >
              <span className="font-medium">{action.label}</span>
              {action.description && (
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Navbar({ userRole = 'renter' }: NavbarProps) {
  const pathname = usePathname()
  const items = getPrimaryNavForRole(userRole)

  return (
    <nav
      className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {items.map(item =>
            item.children?.length ? (
              <NavDropdownItem key={item.label} item={item} pathname={pathname} />
            ) : (
              <NavLinkItem key={item.label} item={item} pathname={pathname} />
            )
          )}
        </div>

        {userRole === 'owner' && <QuickActionsMenu role={userRole} />}
      </div>
    </nav>
  )
}
