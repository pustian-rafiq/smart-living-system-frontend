'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check, ChevronRight, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BrandIcon } from '@/components/layout/BrandLogo'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  getMobileUtilityLinksForRole,
  getPrimaryNavForRole,
  getQuickActionsForRole,
  isChildActive,
  isNavItemActive,
  useNavLabels,
} from '@/lib/navigation'
import type { NavItem } from '@/lib/navigation'
import type { UserRole } from '@/types'
import { useOwnerFocus } from '@/hooks/useOwnerFocus'

interface MobileNavDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole: UserRole
  userName: string
  isVerified?: boolean
}

function linkClass(active: boolean) {
  return cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
    active
      ? 'bg-primary/10 font-medium text-primary'
      : 'text-foreground hover:bg-accent'
  )
}

function NavSection({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate: () => void
}) {
  const { label } = useNavLabels()
  const Icon = item.icon
  const sectionActive = isNavItemActive(pathname, item)

  if (item.href && !item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={linkClass(sectionActive)}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 opacity-80" />}
        <span className="flex-1">{label(item.labelKey)}</span>
        <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
      </Link>
    )
  }

  return (
    <div className="space-y-1">
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide',
          sectionActive ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label(item.labelKey)}
      </div>
      {item.href && (
        <Link
          href={item.href}
          onClick={onNavigate}
          className={linkClass(
            isNavItemActive(pathname, { ...item, children: undefined })
          )}
        >
          <span className="flex-1 pl-7">{label('drawer.overview')}</span>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
        </Link>
      )}
      {item.children?.map(child => (
        <Link
          key={child.href}
          href={child.href}
          onClick={onNavigate}
          className={linkClass(isChildActive(pathname, child))}
        >
          <div className="min-w-0 flex-1 pl-7">
            <div>{label(child.labelKey)}</div>
            {child.descriptionKey && (
              <div className="truncate text-xs text-muted-foreground">
                {label(child.descriptionKey)}
              </div>
            )}
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
        </Link>
      ))}
    </div>
  )
}

export function MobileNavDrawer({
  open,
  onOpenChange,
  userRole,
  userName,
  isVerified = false,
}: MobileNavDrawerProps) {
  const pathname = usePathname()
  const { label } = useNavLabels()
  const { navOptions } = useOwnerFocus()
  const ownerOpts = userRole === 'owner' ? navOptions : undefined

  const navItems = getPrimaryNavForRole(userRole, ownerOpts)
  const utilityLinks = getMobileUtilityLinksForRole(userRole)
  const quickActions = getQuickActionsForRole(userRole, ownerOpts)

  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="flex h-full w-[min(100vw-2rem,320px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xs sm:p-0 md:hidden"
      >
        <SheetHeader className="border-b px-5 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 text-base">
            <BrandIcon />
            {label('drawer.allMenus')}
          </SheetTitle>
          <SheetDescription asChild>
            <div className="space-y-1 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {userName}
                </span>
                {isVerified && (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 px-1.5 py-0 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                  >
                    <Check className="mr-0.5 h-2.5 w-2.5" />
                    {label('drawer.verified')}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {label(`roles.${userRole}`)}
              </p>
            </div>
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 px-3 py-4">
            {quickActions.length > 0 && (
              <div className="space-y-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label('quickActions.title')}
                </p>
                <div className="grid grid-cols-2 gap-2 px-1">
                  {quickActions.map(action => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={close}
                      className="flex flex-col gap-1 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
                    >
                      <Plus className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium leading-tight">
                        {label(action.labelKey)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label('drawer.navigation')}
              </p>
              {navItems.map(item => (
                <NavSection
                  key={item.labelKey}
                  item={item}
                  pathname={pathname}
                  onNavigate={close}
                />
              ))}
            </div>

            {utilityLinks.length > 0 && (
              <div className="space-y-1 border-t pt-4">
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label('drawer.shortcuts')}
                </p>
                {utilityLinks.map(link => {
                  const Icon = link.icon
                  const active =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`)

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      className={linkClass(active)}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-80" />
                      <span className="flex-1">{label(link.labelKey)}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
