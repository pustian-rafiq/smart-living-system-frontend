'use client'

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ExternalLink, MapPin, Star } from 'lucide-react'
import { useMessages } from 'next-intl'
import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PropertyModeration, PropertyStatus } from '@/types/admin'
import {
  PROPERTY_ADMIN_COPY,
  readAdminPropertyCopy,
  type PropertyAdminCopyKey,
} from '@/lib/i18n/property-admin-copy'

const statusColors: Record<PropertyStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  suspended: 'bg-gray-100 text-gray-800',
}

interface PropertyDetailsDialogProps {
  property: PropertyModeration | null
  open: boolean
  onOpenChange: (open: boolean) => void
  busy?: boolean
  onApprove?: (propertyId: string) => void
  onReject?: (propertyId: string) => void
  onSuspend?: (propertyId: string) => void
  onReactivate?: (propertyId: string) => void
  onToggleFeatured?: (propertyId: string) => void
  onToggleVerified?: (propertyId: string) => void
}

export function PropertyDetailsDialog({
  property,
  open,
  onOpenChange,
  busy = false,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
  onToggleFeatured,
  onToggleVerified,
}: PropertyDetailsDialogProps) {
  const messages = useMessages()
  const copy = useMemo(
    () => ({ ...PROPERTY_ADMIN_COPY, ...readAdminPropertyCopy(messages) }),
    [messages],
  )
  const label = (key: PropertyAdminCopyKey) =>
    copy[key] || PROPERTY_ADMIN_COPY[key]
  if (!property) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{property.propertyName}</DialogTitle>
          <DialogDescription>{label('detailsTitle')}</DialogDescription>
        </DialogHeader>

        {property.imageUrl && (
          <div className="relative h-40 w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={property.imageUrl}
              alt={property.propertyName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusColors[property.status]}>
              {property.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {property.propertyType}
            </Badge>
            <Badge variant={property.verified ? 'default' : 'outline'}>
              {property.verified
                ? label('badgeVerified')
                : label('badgeNotVerified')}
            </Badge>
            {property.featured && (
              <Badge className="bg-yellow-500">
                <Star className="mr-1 h-3 w-3" />
                {label('badgeFeatured')}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>
              {property.area}, {property.city}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-muted-foreground">{label('labelOwner')}</p>
              <p className="font-medium">{property.ownerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{label('labelRent')}</p>
              <p className="font-medium">
                {property.rent != null
                  ? `৳${Number(property.rent).toLocaleString()}`
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{label('labelSubmitted')}</p>
              <p className="font-medium">
                {format(new Date(property.submittedAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{label('labelReviewed')}</p>
              <p className="font-medium">
                {property.reviewedAt
                  ? format(new Date(property.reviewedAt), 'MMM dd, yyyy')
                  : '—'}
              </p>
            </div>
          </div>

          {property.description && (
            <div>
              <p className="mb-1 text-muted-foreground">
                {label('labelDescription')}
              </p>
              <p className="line-clamp-4 text-foreground/90">
                {property.description}
              </p>
            </div>
          )}

          {property.rejectionReason && (
            <div>
              <p className="mb-1 text-muted-foreground">
                {label('labelRejectionReason')}
              </p>
              <p className="text-destructive">{property.rejectionReason}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t pt-4">
            {property.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => onApprove?.(property.propertyId)}
                >
                  {label('btnApprove')}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy}
                  onClick={() => onReject?.(property.propertyId)}
                >
                  {label('btnReject')}
                </Button>
              </>
            )}
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
                  {label('btnSuspend')}
                </Button>
              </>
            )}
            {property.status === 'suspended' && (
              <Button
                size="sm"
                disabled={busy}
                onClick={() => onReactivate?.(property.propertyId)}
              >
                {label('btnReactivate')}
              </Button>
            )}
            {property.status === 'rejected' && (
              <Button
                size="sm"
                disabled={busy}
                onClick={() => onApprove?.(property.propertyId)}
              >
                {label('btnApprove')}
              </Button>
            )}
            <Button size="sm" variant="outline" asChild>
              <Link
                href={`/listings/${property.propertyId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {label('btnOpenListing')}
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
