'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { fetchUnreadMessageCount } from '@/lib/api/messages'

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
    const updateCount = () => {
      fetchUnreadMessageCount(userId).then(result => {
        if (result.ok) setUnreadCount(result.data)
      })
    }

    updateCount()
    const interval = setInterval(updateCount, 5000)

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
