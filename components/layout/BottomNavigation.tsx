'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Search,
  FileText,
  User,
  LayoutDashboard,
  Building2,
  Bell,
  MessageCircle,
} from 'lucide-react'
import { NotificationBadge } from '@/components/chat/NotificationBadge'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

interface BottomNavigationProps {
  userRole: UserRole
  userId?: string
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: UserRole[]
}

const getNavItems = (role: UserRole, userId: string): NavItem[] => {
  if (role === 'renter') {
    return [
      {
        label: 'Home',
        href: '/dashboard',
        icon: <Home className="h-5 w-5" />,
        roles: ['renter'],
      },
      {
        label: 'Search',
        href: '/search',
        icon: <Search className="h-5 w-5" />,
        roles: ['renter'],
      },
      {
        label: 'Messages',
        href: '/messages',
        icon: (
          <div className="relative">
            <MessageCircle className="h-5 w-5" />
            <NotificationBadge userId={userId} />
          </div>
        ),
        roles: ['renter'],
      },
      {
        label: 'Bills',
        href: '/bills',
        icon: <FileText className="h-5 w-5" />,
        roles: ['renter'],
      },
      {
        label: 'Profile',
        href: '/profile',
        icon: <User className="h-5 w-5" />,
        roles: ['renter'],
      },
    ]
  } else if (role === 'owner') {
    return [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['owner'],
      },
      {
        label: 'Properties',
        href: '/my-properties',
        icon: <Building2 className="h-5 w-5" />,
        roles: ['owner'],
      },
      {
        label: 'Messages',
        href: '/messages',
        icon: (
          <div className="relative">
            <MessageCircle className="h-5 w-5" />
            <NotificationBadge userId={userId} />
          </div>
        ),
        roles: ['owner'],
      },
      {
        label: 'Notices',
        href: '/notices',
        icon: <Bell className="h-5 w-5" />,
        roles: ['owner'],
      },
      {
        label: 'Profile',
        href: '/profile',
        icon: <User className="h-5 w-5" />,
        roles: ['owner'],
      },
    ]
  } else {
    // Admin
    return [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['admin'],
      },
      {
        label: 'Admin',
        href: '/admin',
        icon: <Building2 className="h-5 w-5" />,
        roles: ['admin'],
      },
      {
        label: 'Notices',
        href: '/notices',
        icon: <Bell className="h-5 w-5" />,
        roles: ['admin'],
      },
      {
        label: 'Profile',
        href: '/profile',
        icon: <User className="h-5 w-5" />,
        roles: ['admin'],
      },
    ]
  }
}

export function BottomNavigation({ userRole, userId }: BottomNavigationProps) {
  const pathname = usePathname()
  const defaultUserId = userRole === 'owner' ? 'owner1' : 'user1'
  const currentUserId = userId || defaultUserId
  const items = getNavItems(userRole, currentUserId)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="mx-auto w-full max-w-[480px]">
        <div className="flex flex-row justify-around gap-0.5 px-1 py-2">
          {items.map(item => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-all',
                  'hover:bg-accent hover:text-accent-foreground active:scale-95',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.icon}
                <span className="max-w-[4.5rem] truncate text-center text-[10px] font-medium leading-tight sm:text-xs">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
