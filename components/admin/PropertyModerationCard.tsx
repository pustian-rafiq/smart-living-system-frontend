'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Check, X, Star, Eye } from 'lucide-react'
import type { PropertyModeration } from '@/types/admin'
import { format } from 'date-fns'
import Image from 'next/image'

interface PropertyModerationCardProps {
  property: PropertyModeration
  onApprove?: (propertyId: string) => void
  onReject?: (propertyId: string) => void
  onView?: (propertyId: string) => void
  onToggleFeatured?: (propertyId: string) => void
  onToggleVerified?: (propertyId: string) => void
}

export function PropertyModerationCard({
  property,
  onApprove,
  onReject,
  onView,
  onToggleFeatured,
  onToggleVerified,
}: PropertyModerationCardProps) {
  const statusColors: Record<PropertyModeration['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-100 text-gray-800',
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <CardTitle className="text-lg">{property.propertyName}</CardTitle>
              <Badge variant="outline" className="capitalize">
                {property.propertyType}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
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
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owner:</span>
            <span className="font-medium">{property.ownerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted:</span>
            <span>
              {format(new Date(property.submittedAt), 'MMM dd, yyyy')}
            </span>
          </div>
          {property.reviewedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reviewed:</span>
              <span>
                {format(new Date(property.reviewedAt), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4 flex gap-2">
          <Badge variant={property.verified ? 'default' : 'outline'}>
            {property.verified ? 'Verified' : 'Not Verified'}
          </Badge>
          {property.featured && (
            <Badge variant="default" className="bg-yellow-500">
              <Star className="mr-1 h-3 w-3" />
              Featured
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {property.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => onApprove?.(property.propertyId)}
                className="flex-1"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject?.(property.propertyId)}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView?.(property.propertyId)}
            className="flex-1"
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          {property.status === 'approved' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleFeatured?.(property.propertyId)}
              >
                {property.featured ? 'Unfeature' : 'Feature'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleVerified?.(property.propertyId)}
              >
                {property.verified ? 'Unverify' : 'Verify'}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
