'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Clock, X, MapPin, DollarSign } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import type { SearchHistory } from '@/types/favorites'

interface SearchHistoryItemProps {
  history: SearchHistory
  onSearch: (history: SearchHistory) => void
  onRemove: (id: string) => void
}

export function SearchHistoryItem({
  history,
  onSearch,
  onRemove,
}: SearchHistoryItemProps) {
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true })
      } else {
        return format(date, 'MMM dd, yyyy HH:mm')
      }
    } catch {
      return ''
    }
  }

  const getFilterSummary = () => {
    const parts: string[] = []
    if (history.filters.propertyType && history.filters.propertyType !== 'all') {
      parts.push(history.filters.propertyType)
    }
    if (history.filters.city) {
      parts.push(history.filters.city)
    }
    if (history.filters.area) {
      parts.push(history.filters.area)
    }
    return parts.length > 0 ? parts.join(' • ') : 'All properties'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Search Query or Filter Summary */}
            {history.searchQuery ? (
              <div className="mb-2">
                <p className="font-semibold text-sm mb-1">"{history.searchQuery}"</p>
                <p className="text-xs text-muted-foreground">{getFilterSummary()}</p>
              </div>
            ) : (
              <p className="font-semibold text-sm mb-2">{getFilterSummary()}</p>
            )}

            {/* Filter Details */}
            <div className="space-y-1 text-xs text-muted-foreground">
              {history.filters.rentRange && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3" />
                  <span>
                    ৳{history.filters.rentRange[0].toLocaleString()} - ৳{history.filters.rentRange[1].toLocaleString()}
                  </span>
                </div>
              )}
              {history.filters.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {history.filters.area ? `${history.filters.area}, ` : ''}
                    {history.filters.city}
                  </span>
                </div>
              )}
            </div>

            {/* Result Count and Time */}
            <div className="mt-2 flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {history.resultCount} {history.resultCount === 1 ? 'result' : 'results'}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTime(history.searchedAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <Button
              variant="default"
              size="sm"
              onClick={() => onSearch(history)}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(history.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
