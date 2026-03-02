'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { NotificationCard } from '@/components/notification/NotificationCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCheck } from 'lucide-react'
import { mockNotifications } from '@/data/mockComplaints'
import type { Notification } from '@/types/complaint'
import { getStoredRole } from '@/utils/auth'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  // Get user role (in real app, get from auth context)
  const userRole = getStoredRole() || 'renter'

  // Filter notifications by user (in real app, filter by logged-in user ID)
  const userNotifications = useMemo(() => {
    return notifications.filter(n => n.userId === 'r1') // Mock: show notifications for first user
  }, [notifications])

  // Sort by date (newest first) and unread first
  const sortedNotifications = useMemo(() => {
    return [...userNotifications].sort((a, b) => {
      // Unread notifications first
      if (a.read !== b.read) {
        return a.read ? 1 : -1
      }
      // Then by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [userNotifications])

  const unreadCount = useMemo(() => {
    return userNotifications.filter(n => !n.read).length
  }, [userNotifications])

  const handleToggleRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ))
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 sm:h-8 sm:w-8" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Notifications</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {sortedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-lg font-semibold text-muted-foreground">
              No notifications
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onToggleRead={handleToggleRead}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
