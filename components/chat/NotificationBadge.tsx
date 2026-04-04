'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { getUnreadCount } from '@/data/mockChats'

interface NotificationBadgeProps {
  userId: string
  className?: string
}

export function NotificationBadge({
  userId,
  className,
}: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Update unread count
    const updateCount = () => {
      const count = getUnreadCount(userId)
      setUnreadCount(count)
    }

    updateCount()
    // In real app, this would be a WebSocket subscription or polling
    const interval = setInterval(updateCount, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [userId])

  if (unreadCount === 0) return null

  return (
    <Badge
      variant="destructive"
      className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs ${className}`}
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </Badge>
  )
}
