'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Check, X, Star, Eye, Pause, Play } from 'lucide-react'
import type { PropertyModeration } from '@/types/admin'
import { format } from 'date-fns'
import Image from 'next/image'
import { useMessages } from 'next-intl'
import { useMemo } from 'react'
import {
  PROPERTY_ADMIN_COPY,
  readAdminPropertyCopy,
  type PropertyAdminCopyKey,
} from '@/lib/i18n/property-admin-copy'

interface PropertyModerationCardProps {
  property: PropertyModeration
  busy?: boolean
  onApprove?: (propertyId: string) => void
  onReject?: (propertyId: string) => void
  onView?: (propertyId: string) => void
  onSuspend?: (propertyId: string) => void
  onReactivate?: (propertyId: string) => void
  onToggleFeatured?: (propertyId: string) => void
  onToggleVerified?: (propertyId: string) => void
}

export function PropertyModerationCard({
  property,
  busy = false,
  onApprove,
  onReject,
  onView,
  onSuspend,
  onReactivate,
  onToggleFeatured,
  onToggleVerified,
}: PropertyModerationCardProps) {
  const messages = useMessages()
  const copy = useMemo(
    () => ({ ...PROPERTY_ADMIN_COPY, ...readAdminPropertyCopy(messages) }),
    [messages],
  )
  const label = (key: PropertyAdminCopyKey) =>
    copy[key] || PROPERTY_ADMIN_COPY[key]
  const statusColors: Record<PropertyModeration['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-100 text-gray-800',
  }

  return (
    <Card>
      {property.imageUrl && (
        <div className="relative h-36 w-full overflow-hidden rounded-t-lg bg-muted">
          <Image
            src={property.imageUrl}
            alt={property.propertyName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg leading-snug">
                {property.propertyName}
              </CardTitle>
              <Badge variant="outline" className="capitalize">
                {property.propertyType}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>
                {property.area}, {property.city}
              </span>
            </div>
          </div>
          <Badge className={statusColors[property.status]}>
            {property.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">{label('labelOwner')}:</span>
            <span className="truncate font-medium">{property.ownerName}</span>
          </div>
          {property.rent != null && (
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">{label('labelRent')}:</span>
              <span className="font-medium">
                ৳{Number(property.rent).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">
              {label('labelSubmitted')}:
            </span>
            <span>
              {format(new Date(property.submittedAt), 'MMM dd, yyyy')}
            </span>
          </div>
          {property.reviewedAt && (
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {label('labelReviewed')}:
              </span>
              <span>
                {format(new Date(property.reviewedAt), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant={property.verified ? 'default' : 'outline'}>
            {property.verified
              ? label('badgeVerified')
              : label('badgeNotVerified')}
          </Badge>
          {property.featured && (
            <Badge variant="default" className="bg-yellow-500">
              <Star className="mr-1 h-3 w-3" />
              {label('badgeFeatured')}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {property.status === 'pending' && (
            <>
              <Button
                size="sm"
                disabled={busy}
                onClick={() => onApprove?.(property.propertyId)}
                className="flex-1"
              >
                <Check className="mr-2 h-4 w-4" />
                {label('btnApprove')}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={busy}
                onClick={() => onReject?.(property.propertyId)}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                {label('btnReject')}
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => onView?.(property.propertyId)}
            className="flex-1"
          >
            <Eye className="mr-2 h-4 w-4" />
            {label('btnView')}
          </Button>
          {property.status === 'approved' && (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => onToggleFeatured?.(property.propertyId)}
              >
                {property.featured
                  ? label('btnRemoveFeature')
                  : label('btnFeature')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => onToggleVerified?.(property.propertyId)}
              >
                {property.verified
                  ? label('btnRemoveVerify')
                  : label('btnVerify')}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={() => onSuspend?.(property.propertyId)}
              >
                <Pause className="mr-2 h-4 w-4" />
                {label('btnSuspend')}
              </Button>
            </>
          )}
          {property.status === 'suspended' && (
            <Button
              size="sm"
              disabled={busy}
              onClick={() => onReactivate?.(property.propertyId)}
              className="flex-1"
            >
              <Play className="mr-2 h-4 w-4" />
              {label('btnReactivate')}
            </Button>
          )}
          {property.status === 'rejected' && (
            <Button
              size="sm"
              disabled={busy}
              onClick={() => onApprove?.(property.propertyId)}
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              {label('btnApprove')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
