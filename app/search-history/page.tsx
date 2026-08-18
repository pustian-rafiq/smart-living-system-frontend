'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { LoadingState } from '@/components/page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchHistoryItem } from '@/components/search/SearchHistoryItem'
import {
  fetchSearchHistory,
  clearUserSearchHistory,
  deleteSearchHistoryEntry,
} from '@/lib/api/search'
import { getCurrentAccountUserId } from '@/lib/api/account'
import { useMockQuery } from '@/hooks/useMockQuery'
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
  const t = useTranslations('search.history')
  const tc = useTranslations('common')
  const [showClearDialog, setShowClearDialog] = useState(false)

  const userId = getCurrentAccountUserId()
  const load = useCallback(() => fetchSearchHistory(userId), [userId])
  const { data: history, loading, refetch } = useMockQuery(load)

  const historyList = history ?? []

  const handleSearch = (historyItem: SearchHistory) => {
    const params = new URLSearchParams()
    if (
      historyItem.filters.propertyType &&
      historyItem.filters.propertyType !== 'all'
    ) {
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

  const handleRemove = async (id: string) => {
    await deleteSearchHistoryEntry(id)
    refetch()
  }

  const handleClearAll = async () => {
    await clearUserSearchHistory(userId)
    setShowClearDialog(false)
    refetch()
  }

  if (loading) {
    return (
      <Layout>
        <LoadingState label={t('title')} />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('countInHistory', { count: historyList.length })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {historyList.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowClearDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {tc('clearAll')}
                </Button>
              )}
              <Button onClick={() => router.push('/search')}>
                <Search className="mr-2 h-4 w-4" />
                {tc('newSearch')}
              </Button>
            </div>
          </div>
        </div>

        {historyList.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">
                {t('emptyTitle')}
              </p>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                {t('emptyDesc')}
              </p>
              <Button className="mt-4" onClick={() => router.push('/search')}>
                <Search className="mr-2 h-4 w-4" />
                {t('startSearching')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {historyList.map(historyItem => (
              <SearchHistoryItem
                key={historyItem.id}
                history={historyItem}
                onSearch={handleSearch}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('clearConfirmTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('clearConfirmDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tc('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-destructive text-destructive-foreground"
              >
                {tc('clearAll')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  )
}
