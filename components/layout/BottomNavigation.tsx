'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  getBottomNavForRole,
  isHrefActive,
  useNavLabels,
} from '@/lib/navigation'
import { useMobileNav } from '@/components/layout/MobileNavContext'
import type { UserRole } from '@/types'

interface BottomNavigationProps {
  userRole: UserRole
}

const tabClass = (active: boolean) =>
  cn(
    'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg p-2 transition-all',
    'hover:bg-accent hover:text-accent-foreground active:scale-95',
    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
  )

export function BottomNavigation({ userRole }: BottomNavigationProps) {
  const pathname = usePathname()
  const { isOpen, openMenu } = useMobileNav()
  const { label } = useNavLabels()
  const items = getBottomNavForRole(userRole)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto w-full max-w-lg">
        <div className="flex flex-row justify-around gap-0.5 px-1 py-2">
          {items.map(item => {
            const Icon = item.icon

            if (item.action === 'menu') {
              return (
                <button
                  key={`${item.roles.join('-')}-menu`}
                  type="button"
                  onClick={openMenu}
                  aria-label="Open all menus"
                  aria-expanded={isOpen}
                  className={tabClass(isOpen)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="max-w-full truncate text-center text-[10px] font-medium leading-tight sm:text-xs">
                    {label(item.labelKey)}
                  </span>
                </button>
              )
            }

            const active = isHrefActive(
              pathname,
              item.href!,
              item.matchPrefixes
            )

            return (
              <Link
                key={`${item.roles.join('-')}-${item.href}-${item.labelKey}`}
                href={item.href!}
                className={tabClass(active)}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                <span className="max-w-full truncate text-center text-[10px] font-medium leading-tight sm:text-xs">
                  {label(item.labelKey)}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
