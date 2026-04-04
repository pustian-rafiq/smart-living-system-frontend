'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, MessageSquare } from 'lucide-react'
import type { Complaint } from '@/types/complaint'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

interface ComplaintCardProps {
  complaint: Complaint
}

const statusConfig = {
  open: {
    label: 'Open',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  },
  in_progress: {
    label: 'In Progress',
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  resolved: {
    label: 'Resolved',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
  },
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const [imageError, setImageError] = useState(false)
  const status = statusConfig[complaint.status]

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl">
              {complaint.title}
            </CardTitle>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{complaint.userName}</span>
            </div>
          </div>
          <Badge variant="outline" className={cn('shrink-0', status.className)}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {complaint.description}
        </p>

        {/* Image */}
        {complaint.imageUrl && !imageError && (
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={complaint.imageUrl}
              alt={complaint.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Response (if available) */}
        {complaint.response && (
          <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-3">
            <div className="flex items-start gap-2">
              <MessageSquare className="mt-0.5 h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs font-medium text-primary">Response</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {complaint.response}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Created: {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          </div>
          {complaint.resolvedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
