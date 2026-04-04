'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Bell, X, Search, ExternalLink } from 'lucide-react'
import {
  mockSavedSearches,
  getActiveSavedSearches,
} from '@/data/mockSavedSearches'
import { mockProperties } from '@/data/mockProperties'
import type { SavedSearch } from '@/types/savedSearch'
import type { Property, SearchFilters } from '@/types/property'
import { useRouter } from 'next/navigation'

interface SearchNotificationProps {
  userId: string
}

interface MatchNotification {
  savedSearch: SavedSearch
  newMatches: Property[]
  matchCount: number
}

// Helper function to check if property matches search filters
function propertyMatchesFilters(
  property: Property,
  filters: SearchFilters
): boolean {
  // Property type
  if (
    filters.propertyType !== 'all' &&
    property.type !== filters.propertyType
  ) {
    return false
  }

  // City
  if (filters.city && property.city !== filters.city) {
    return false
  }

  // Area
  if (filters.area && property.area !== filters.area) {
    return false
  }

  // Rent range
  if (
    property.rent < filters.rentRange[0] ||
    property.rent > filters.rentRange[1]
  ) {
    return false
  }

  // Available only
  if (filters.availableOnly && !property.available) {
    return false
  }

  // Verified only
  if (filters.verifiedOnly && !property.verified) {
    return false
  }

  // Gender (for mess/hostel)
  if (
    filters.gender &&
    (property.type === 'mess' || property.type === 'hostel')
  ) {
    if (
      property.gender &&
      property.gender !== filters.gender &&
      property.gender !== 'mixed'
    ) {
      return false
    }
  }

  // Seat type
  if (filters.seatType && property.seatType !== filters.seatType) {
    return false
  }

  // Meal included
  if (
    filters.mealIncluded !== undefined &&
    property.mealIncluded !== filters.mealIncluded
  ) {
    return false
  }

  // Meal plan
  if (filters.mealPlan && property.mealPlan !== filters.mealPlan) {
    return false
  }

  // Nearby facilities
  if (filters.nearbyFacilities && filters.nearbyFacilities.length > 0) {
    const propertyFacilities = property.nearbyFacilities || []
    const hasAllFacilities = filters.nearbyFacilities.every(facility =>
      propertyFacilities.includes(facility)
    )
    if (!hasAllFacilities) {
      return false
    }
  }

  // Building age
  if (filters.buildingAge !== undefined && property.buildingAge !== undefined) {
    if (property.buildingAge > filters.buildingAge) {
      return false
    }
  }

  // Floor level
  if (filters.floorLevel !== undefined && property.floorLevel !== undefined) {
    if (property.floorLevel > filters.floorLevel) {
      return false
    }
  }

  // Furnishing
  if (filters.furnishing && property.furnishing !== filters.furnishing) {
    return false
  }

  // Parking
  if (filters.parking !== undefined && property.parking !== filters.parking) {
    return false
  }

  // Security
  if (
    filters.security !== undefined &&
    property.security !== filters.security
  ) {
    return false
  }

  return true
}

export function SearchNotification({ userId }: SearchNotificationProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<MatchNotification[]>([])
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [hasNewMatches, setHasNewMatches] = useState(false)

  useEffect(() => {
    const checkForNewMatches = () => {
      const activeSearches = getActiveSavedSearches(userId)
      const newNotifications: MatchNotification[] = []

      activeSearches.forEach(savedSearch => {
        // Find properties that match this search
        const matchingProperties = mockProperties.filter(property =>
          propertyMatchesFilters(property, savedSearch.filters)
        )

        // Check if there are new matches (properties created after last check)
        const lastChecked = savedSearch.lastChecked
          ? new Date(savedSearch.lastChecked)
          : new Date(savedSearch.createdAt)

        const newMatches = matchingProperties.filter(property => {
          const propertyDate = new Date(property.createdAt)
          return propertyDate > lastChecked
        })

        if (newMatches.length > 0) {
          newNotifications.push({
            savedSearch,
            newMatches,
            matchCount: matchingProperties.length,
          })
        }
      })

      if (newNotifications.length > 0) {
        setNotifications(newNotifications)
        setHasNewMatches(true)
        // Update last checked time for all searches
        newNotifications.forEach(notification => {
          notification.savedSearch.lastChecked = new Date().toISOString()
          notification.savedSearch.matchCount = notification.matchCount
          notification.savedSearch.updatedAt = new Date().toISOString()
        })
      }
    }

    // Check immediately
    checkForNewMatches()

    // Check every 5 minutes (in real app, this would be server-side)
    const interval = setInterval(checkForNewMatches, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [userId])

  const handleViewMatches = (savedSearch: SavedSearch) => {
    // Navigate to search page with filters
    const params = new URLSearchParams()
    if (
      savedSearch.filters.propertyType &&
      savedSearch.filters.propertyType !== 'all'
    ) {
      params.set('type', savedSearch.filters.propertyType)
    }
    if (savedSearch.filters.city) {
      params.set('city', savedSearch.filters.city)
    }
    if (savedSearch.filters.area) {
      params.set('area', savedSearch.filters.area)
    }
    params.set('minRent', savedSearch.filters.rentRange[0].toString())
    params.set('maxRent', savedSearch.filters.rentRange[1].toString())
    if (savedSearch.filters.availableOnly) {
      params.set('availableOnly', 'true')
    }
    if (savedSearch.filters.verifiedOnly) {
      params.set('verifiedOnly', 'true')
    }
    router.push(`/search?${params.toString()}`)
    setShowNotificationDialog(false)
    setHasNewMatches(false)
    setNotifications([])
  }

  const handleDismiss = () => {
    setShowNotificationDialog(false)
    setHasNewMatches(false)
    setNotifications([])
  }

  if (!hasNewMatches || notifications.length === 0) {
    return null
  }

  const totalNewMatches = notifications.reduce(
    (sum, notif) => sum + notif.newMatches.length,
    0
  )

  return (
    <>
      {/* Notification Badge */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setShowNotificationDialog(true)}
      >
        <Bell className="h-5 w-5" />
        {totalNewMatches > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {totalNewMatches > 9 ? '9+' : totalNewMatches}
          </Badge>
        )}
      </Button>

      {/* Notification Dialog */}
      <Dialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              New Property Matches!
            </DialogTitle>
            <DialogDescription>
              {totalNewMatches} new{' '}
              {totalNewMatches === 1 ? 'property matches' : 'properties match'}{' '}
              your saved searches
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {notifications.map(notification => (
              <Card
                key={notification.savedSearch.id}
                className="border-l-4 border-l-primary"
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">
                        {notification.savedSearch.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {notification.newMatches.length} new{' '}
                        {notification.newMatches.length === 1
                          ? 'match'
                          : 'matches'}{' '}
                        found
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {notification.matchCount} total matches
                    </Badge>
                  </div>

                  {/* New Matches Preview */}
                  <div className="space-y-2 mb-4">
                    {notification.newMatches.slice(0, 3).map(property => (
                      <div
                        key={property.id}
                        className="flex items-center justify-between p-2 rounded border bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {property.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {property.area}, {property.city} • ৳
                            {property.rent.toLocaleString()}/month
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            router.push(`/search?propertyId=${property.id}`)
                            handleDismiss()
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {notification.newMatches.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{notification.newMatches.length - 3} more matches
                      </p>
                    )}
                  </div>

                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => handleViewMatches(notification.savedSearch)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    View All Matches
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/saved-searches')}
            >
              Manage Saved Searches
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDismiss}
            >
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
