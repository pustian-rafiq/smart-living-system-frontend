'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/components/theme/ThemeProvider'
import { LanguageSwitcher } from '@/components/i18n'
import { Button } from '@/components/ui/button'
import { NotificationBadge } from '@/components/chat/NotificationBadge'
import { SearchNotification } from '@/components/search/SearchNotification'
import { UserAccountMenu } from '@/components/layout/UserAccountMenu'
import {
  Moon,
  Sun,
  MessageCircle,
  Bell,
  Heart,
  Clock,
  Bookmark,
} from 'lucide-react'
import {
  getDisplayName,
  getProfilePhotoUrl,
  getStoredRole,
  isLoggedIn,
} from '@/utils/auth'
import type { UserRole } from '@/types'
import { getDemoUserId } from '@/lib/api/demoUser'

export function AppHeader() {
  const t = useTranslations('layout')
  const { theme, toggle: toggleTheme } = useTheme()
  const [userName, setUserName] = useState('Guest')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const syncUser = () => {
      const logged = isLoggedIn()
      setLoggedIn(logged)
      setRole(getStoredRole())
      if (logged) {
        setUserName(getDisplayName())
        setPhotoUrl(getProfilePhotoUrl())
        setIsVerified(sessionStorage.getItem('otpVerified') === 'true')
      }
    }

    setMounted(true)
    syncUser()

    window.addEventListener('profile-updated', syncUser)
    return () => window.removeEventListener('profile-updated', syncUser)
  }, [])

  const userId = getDemoUserId(role)

  const themeButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 shrink-0 md:h-10 md:w-10"
      aria-label={t('toggleTheme')}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 md:h-5 md:w-5" />
      ) : (
        <Moon className="h-4 w-4 md:h-5 md:w-5" />
      )}
    </Button>
  )

  const messagesButton = (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="relative h-9 w-9 shrink-0 md:h-10 md:w-10"
      title={t('messages')}
    >
      <Link href="/messages">
        <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
        <NotificationBadge userId={userId} />
      </Link>
    </Button>
  )

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-2">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">SL</span>
            </div>
            <span className="hidden truncate text-lg font-bold sm:inline-block">
              {t('brand')}
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex md:gap-3">
            {!mounted ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : loggedIn && role ? (
              <>
                <SearchNotification userId={userId} />
                {role === 'renter' && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title={t('favorites')}
                    >
                      <Link href="/favorites">
                        <Heart className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title={t('searchHistory')}
                    >
                      <Link href="/search-history">
                        <Clock className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title={t('savedSearches')}
                    >
                      <Link href="/saved-searches">
                        <Bookmark className="h-5 w-5" />
                      </Link>
                    </Button>
                  </>
                )}
                {role === 'owner' && (
                  <Button variant="ghost" size="icon" asChild title={t('notices')}>
                    <Link href="/notices">
                      <Bell className="h-5 w-5" />
                    </Link>
                  </Button>
                )}
                {messagesButton}
                {themeButton}
                <LanguageSwitcher variant="ghost" size="sm" />
                <UserAccountMenu
                  userName={userName}
                  isVerified={isVerified}
                  role={role}
                  photoUrl={photoUrl}
                  showName
                  className="px-1"
                />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">{t('login')}</Link>
                </Button>
                <LanguageSwitcher variant="ghost" size="sm" />
                {themeButton}
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex min-w-0 items-center gap-0.5 md:hidden">
            {!mounted ? (
              <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            ) : loggedIn && role ? (
              <>
                <SearchNotification userId={userId} />
                {role === 'owner' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9 shrink-0"
                    title="Notices"
                  >
                    <Link href="/notices">
                      <Bell className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {messagesButton}
                {themeButton}
                <LanguageSwitcher variant="ghost" size="sm" />
                <UserAccountMenu
                  userName={userName}
                  isVerified={isVerified}
                  role={role}
                  photoUrl={photoUrl}
                />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="shrink-0">
                  <Link href="/login">{t('login')}</Link>
                </Button>
                <LanguageSwitcher variant="ghost" size="sm" />
                {themeButton}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
