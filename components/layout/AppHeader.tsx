'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/theme/ThemeProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NotificationBadge } from '@/components/chat/NotificationBadge'
import { SearchNotification } from '@/components/search/SearchNotification'
import { Check, Moon, Sun, Menu, X, MessageCircle, Heart, Clock, Bookmark, Bell } from 'lucide-react'
import { getStoredRole, isLoggedIn } from '@/utils/auth'
import { cn } from '@/lib/utils'

export function AppHeader() {
  const { theme, toggle: toggleTheme } = useTheme()
  const [userName, setUserName] = useState('Guest')
  const [isVerified, setIsVerified] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isLoggedIn()) {
      const phone = sessionStorage.getItem('loginPhone')
      if (phone) {
        setUserName('User ' + phone.slice(-4))
        setIsVerified(true)
      }
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">SL</span>
            </div>
            <span className="hidden text-lg font-bold sm:inline-block">
              Smart Living
            </span>
          </Link>

          {/* Desktop: User Greeting & Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {!mounted ? (
              // Show loading state during hydration to prevent mismatch
              <div className="flex items-center gap-2">
                <div className="h-5 w-20 animate-pulse rounded bg-muted" />
              </div>
            ) : isLoggedIn() ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Hello,</span>
                  <span className="text-sm font-medium">{userName}</span>
                  {isVerified && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <SearchNotification userId={getStoredRole() === 'owner' ? 'owner1' : 'user1'} />
                {getStoredRole() === 'renter' && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Favorites"
                    >
                      <Link href="/favorites">
                        <Heart className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Search History"
                    >
                      <Link href="/search-history">
                        <Clock className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Saved Searches"
                    >
                      <Link href="/saved-searches">
                        <Bookmark className="h-5 w-5" />
                      </Link>
                    </Button>
                  </>
                )}
                {getStoredRole() === 'owner' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="Notices"
                  >
                    <Link href="/notices">
                      <Bell className="h-5 w-5" />
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="relative"
                >
                  <Link href="/messages">
                    <MessageCircle className="h-5 w-5" />
                    <NotificationBadge userId={getStoredRole() === 'owner' ? 'owner1' : 'user1'} />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile: User Info & Menu */}
          <div className="flex items-center gap-2 md:hidden">
            {!mounted ? (
              // Show loading state during hydration
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            ) : isLoggedIn() && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium">{userName}</span>
                {isVerified && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 px-1.5 py-0"
                  >
                    <Check className="h-2.5 w-2.5" />
                  </Badge>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
