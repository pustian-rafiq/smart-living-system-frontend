'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchHistoryItem } from '@/components/search/SearchHistoryItem'
import {
  getSearchHistoryByUserId,
  clearSearchHistory,
} from '@/data/mockSearchHistory'
import type { SearchHistory } from '@/types/favorites'
import { Search, Clock, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function SearchHistoryPage() {
  const router = useRouter()
  const [showClearDialog, setShowClearDialog] = useState(false)

  // Get current user ID (in real app, this would come from auth)
  const currentUserId = 'user1' // Mock user ID

  const history = useMemo(() => {
    return getSearchHistoryByUserId(currentUserId)
  }, [currentUserId])

  const handleSearch = (historyItem: SearchHistory) => {
    // Navigate to search page with filters
    const params = new URLSearchParams()
    if (historyItem.filters.propertyType && historyItem.filters.propertyType !== 'all') {
      params.set('type', historyItem.filters.propertyType)
    }
    if (historyItem.filters.city) {
      params.set('city', historyItem.filters.city)
    }
    if (historyItem.filters.area) {
      params.set('area', historyItem.filters.area)
    }
    if (historyItem.filters.rentRange) {
      params.set('minRent', historyItem.filters.rentRange[0].toString())
      params.set('maxRent', historyItem.filters.rentRange[1].toString())
    }
    if (historyItem.searchQuery) {
      params.set('q', historyItem.searchQuery)
    }
    router.push(`/search?${params.toString()}`)
  }

  const handleRemove = (id: string) => {
    // In real app, this would call an API
    const index = getSearchHistoryByUserId(currentUserId).findIndex(h => h.id === id)
    if (index > -1) {
      // Remove from mock data
      const allHistory = getSearchHistoryByUserId(currentUserId)
      allHistory.splice(index, 1)
    }
  }

  const handleClearAll = () => {
    clearSearchHistory(currentUserId)
    setShowClearDialog(false)
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Search History</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {history.length} {history.length === 1 ? 'search' : 'searches'} in history
              </p>
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowClearDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
              <Button onClick={() => router.push('/search')}>
                <Search className="mr-2 h-4 w-4" />
                New Search
              </Button>
            </div>
          </div>
        </div>

        {/* Search History List */}
        {history.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">
                No search history
              </p>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Your recent searches will appear here
              </p>
              <Button className="mt-4" onClick={() => router.push('/search')}>
                <Search className="mr-2 h-4 w-4" />
                Start Searching
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((historyItem) => (
              <SearchHistoryItem
                key={historyItem.id}
                history={historyItem}
                onSearch={handleSearch}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

        {/* Clear All Dialog */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Search History?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your search history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground">
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  )
}
