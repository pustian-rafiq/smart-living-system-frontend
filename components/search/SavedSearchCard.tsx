'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Bell, BellOff, Search, Trash2, Edit, MapPin, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import type { SavedSearch } from '@/types/savedSearch'

interface SavedSearchCardProps {
  savedSearch: SavedSearch
  onToggle: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
  onEdit: (savedSearch: SavedSearch) => void
  onSearch: (savedSearch: SavedSearch) => void
}

export function SavedSearchCard({
  savedSearch,
  onToggle,
  onDelete,
  onEdit,
  onSearch,
}: SavedSearchCardProps) {
  const formatLastChecked = (timestamp?: string) => {
    if (!timestamp) return 'Never'
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm')
    } catch {
      return 'Never'
    }
  }

  const getFilterSummary = () => {
    const parts: string[] = []
    if (savedSearch.filters.propertyType && savedSearch.filters.propertyType !== 'all') {
      parts.push(savedSearch.filters.propertyType)
    }
    if (savedSearch.filters.city) {
      parts.push(savedSearch.filters.city)
    }
    if (savedSearch.filters.area) {
      parts.push(savedSearch.filters.area)
    }
    return parts.length > 0 ? parts.join(' • ') : 'All properties'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{savedSearch.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getFilterSummary()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {savedSearch.isActive ? (
              <Badge variant="default" className="bg-green-500">
                <Bell className="mr-1 h-3 w-3" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">
                <BellOff className="mr-1 h-3 w-3" />
                Inactive
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Rent Range:</span>
            <span className="font-medium">
              ৳{savedSearch.filters.rentRange[0].toLocaleString()} - ৳{savedSearch.filters.rentRange[1].toLocaleString()}
            </span>
          </div>
          {savedSearch.filters.city && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">
                {savedSearch.filters.area ? `${savedSearch.filters.area}, ` : ''}
                {savedSearch.filters.city}
              </span>
            </div>
          )}
          {savedSearch.matchCount !== undefined && (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Matches:</span>
              <span className="font-medium">{savedSearch.matchCount} properties</span>
            </div>
          )}
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap gap-1.5">
          {savedSearch.filters.availableOnly && (
            <Badge variant="outline" className="text-xs">Available Only</Badge>
          )}
          {savedSearch.filters.verifiedOnly && (
            <Badge variant="outline" className="text-xs">Verified Only</Badge>
          )}
          {savedSearch.filters.gender && (
            <Badge variant="outline" className="text-xs capitalize">
              {savedSearch.filters.gender}
            </Badge>
          )}
          {savedSearch.filters.furnishing && (
            <Badge variant="outline" className="text-xs capitalize">
              {savedSearch.filters.furnishing}
            </Badge>
          )}
          {savedSearch.filters.parking && (
            <Badge variant="outline" className="text-xs">Parking</Badge>
          )}
          {savedSearch.filters.security && (
            <Badge variant="outline" className="text-xs">Security</Badge>
          )}
        </div>

        {/* Last Checked */}
        <div className="text-xs text-muted-foreground">
          Last checked: {formatLastChecked(savedSearch.lastChecked)}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Notifications:</span>
            <Switch
              checked={savedSearch.isActive}
              onCheckedChange={(checked) => onToggle(savedSearch.id, checked)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSearch(savedSearch)}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(savedSearch)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(savedSearch.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
