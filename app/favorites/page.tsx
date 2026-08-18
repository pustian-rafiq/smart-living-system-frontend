'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { EmptyState, LoadingState } from '@/components/page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FavoriteCard } from '@/components/favorites/FavoriteCard'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  fetchFavorites,
  toggleFavorite,
} from '@/lib/api/favorites'
import { fetchPropertiesByIds } from '@/lib/api/properties'
import { getCurrentAccountUserId } from '@/lib/api/account'
import { useMockQuery } from '@/hooks/useMockQuery'
import type { Favorite } from '@/types/favorites'
import type { Property } from '@/types/property'
import { Heart, Share2, Search, GitCompare } from 'lucide-react'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

function CompareTableBody({
  properties,
  onView,
  onClose,
}: {
  properties: Property[]
  onView: (id: string) => void
  onClose: () => void
}) {
  const t = useTranslations('property.compare')
  const tSearch = useTranslations('search.page.actions')

  return (
    <>
      <tr className="border-b">
        <td className="p-2 font-medium">{t('fields.type')}</td>
        {properties.map(property => (
          <td key={property.id} className="p-2 text-center capitalize">
            {property.type}
          </td>
        ))}
      </tr>
      <tr className="border-b">
        <td className="p-2 font-medium">{t('fields.rent')}</td>
        {properties.map(property => (
          <td
            key={property.id}
            className="p-2 text-center font-semibold text-primary"
          >
            ৳{property.rent.toLocaleString()}
            {t('perMonth')}
          </td>
        ))}
      </tr>
      <tr className="border-b">
        <td className="p-2 font-medium">{t('fields.location')}</td>
        {properties.map(property => (
          <td key={property.id} className="p-2 text-center text-sm">
            {property.area}, {property.city}
          </td>
        ))}
      </tr>
      <tr className="border-b">
        <td className="p-2 font-medium">{t('fields.available')}</td>
        {properties.map(property => (
          <td key={property.id} className="p-2 text-center">
            {property.available ? (
              <span className="text-green-600">{t('yes')}</span>
            ) : (
              <span className="text-red-600">{t('no')}</span>
            )}
          </td>
        ))}
      </tr>
      <tr className="border-b">
        <td className="p-2 font-medium">{t('fields.verified')}</td>
        {properties.map(property => (
          <td key={property.id} className="p-2 text-center">
            {property.verified ? (
              <span className="text-green-600">{t('yes')}</span>
            ) : (
              <span className="text-gray-400">{t('no')}</span>
            )}
          </td>
        ))}
      </tr>
      <tr className="border-b">
        <td className="p-2 font-medium">{t('facilities')}</td>
        {properties.map(property => (
          <td key={property.id} className="p-2 text-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {property.facilities.slice(0, 3).map((facility, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-muted px-2 py-1 rounded"
                >
                  {facility}
                </span>
              ))}
              {property.facilities.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{property.facilities.length - 3}
                </span>
              )}
            </div>
          </td>
        ))}
      </tr>
      <tr>
        <td className="p-2 font-medium">{t('fields.actions')}</td>
        {properties.map(property => (
          <td key={property.id} className="p-2 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onView(property.id)
                onClose()
              }}
            >
              {tSearch('viewDetails')}
            </Button>
          </td>
        ))}
      </tr>
    </>
  )
}

export default function FavoritesPage() {
  const { confirm } = useConfirm()
  const router = useRouter()
  const t = useTranslations('property.favorites')
  const tc = useTranslations('common')
  const tCompare = useTranslations('property.compare')
  const tSearch = useTranslations('search.page.actions')
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([])
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [showCompareDialog, setShowCompareDialog] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'rent' | 'name'>('date')

  const userId = getCurrentAccountUserId()
  const loadFavorites = useCallback(() => fetchFavorites(userId), [userId])
  const {
    data: favoritesData,
    loading,
    refetch,
  } = useMockQuery(loadFavorites)

  const favorites = useMemo(() => {
    const favs = favoritesData ?? []
    return [...favs].sort((a, b) => {
      switch (sortBy) {
        case 'rent':
          return a.propertyRent - b.propertyRent
        case 'name':
          return a.propertyName.localeCompare(b.propertyName)
        case 'date':
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })
  }, [favoritesData, sortBy])

  const compareIds = useMemo(
    () =>
      selectedFavorites
        .map(id => favorites.find(f => f.id === id)?.propertyId)
        .filter((id): id is string => Boolean(id)),
    [selectedFavorites, favorites]
  )
  const loadCompareProperties = useCallback(
    () => fetchPropertiesByIds(compareIds),
    [compareIds]
  )
  const { data: comparePropertiesData } = useMockQuery(loadCompareProperties)

  const handleRemove = async (id: string) => {
    const ok = await confirm({
      title: t('removeConfirmTitle'),
      description: t('removeConfirmDesc'),
    })
    if (!ok) return
    const favorite = favorites.find(fav => fav.id === id)
    if (favorite) {
      await toggleFavorite(favorite.propertyId, userId)
      refetch()
    }
    setSelectedFavorites(selectedFavorites.filter(favId => favId !== id))
  }

  const handleView = (propertyId: string) => {
    router.push(`/search?propertyId=${propertyId}`)
  }

  const handleShare = (favorite: Favorite) => {
    const url = `${window.location.origin}/search?propertyId=${favorite.propertyId}`
    setShareUrl(url)
    setShowShareDialog(true)
  }

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success(t('linkCopied'))
  }

  const handleToggleSelect = (id: string) => {
    setSelectedFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    )
  }

  const handleCompare = () => {
    if (selectedFavorites.length < 2) {
      toast.error(t('selectMinCompare'))
      return
    }
    if (selectedFavorites.length > 4) {
      toast.error(t('selectMaxCompare'))
      return
    }
    setShowCompareDialog(true)
  }

  const propertiesToCompare = comparePropertiesData ?? []

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
                {t('count', { count: favorites.length })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedFavorites.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCompare}
                    disabled={selectedFavorites.length < 2}
                  >
                    <GitCompare className="mr-2 h-4 w-4" />
                    {t('compare', { count: selectedFavorites.length })}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFavorites([])}
                  >
                    {t('clearSelection')}
                  </Button>
                </>
              )}
              <Button onClick={() => router.push('/search')}>
                <Search className="mr-2 h-4 w-4" />
                {t('findMore')}
              </Button>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Label>{t('sortBy')}:</Label>
              <Select
                value={sortBy}
                onValueChange={value =>
                  setSortBy(value as 'date' | 'rent' | 'name')
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">{t('sortDate')}</SelectItem>
                  <SelectItem value="rent">{t('sortRent')}</SelectItem>
                  <SelectItem value="name">{t('sortName')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title={t('emptyTitle')}
            description={t('emptyDesc')}
          >
            <Button onClick={() => router.push('/search')}>
              <Search className="mr-2 h-4 w-4" />
              {t('browse')}
            </Button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map(favorite => (
              <div key={favorite.id} className="relative">
                <FavoriteCard
                  favorite={favorite}
                  onRemove={handleRemove}
                  onView={handleView}
                  onShare={handleShare}
                />
                <div className="absolute left-2 top-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedFavorites.includes(favorite.id)}
                    onChange={() => handleToggleSelect(favorite.id)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('shareTitle')}</DialogTitle>
              <DialogDescription>{t('shareDesc')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t('shareLink')}</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={shareUrl} readOnly />
                  <Button onClick={handleCopyShareUrl}>{t('copy')}</Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: t('checkOutProperty'),
                        url: shareUrl,
                      })
                    }
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {t('share')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowShareDialog(false)}
                >
                  {tc('close')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('compareDialogTitle')}</DialogTitle>
              <DialogDescription>
                {t('compareDialogDesc', {
                  count: propertiesToCompare.length,
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">
                        {tCompare('fields.property')}
                      </th>
                      {propertiesToCompare.map(property => (
                        <th
                          key={property.id}
                          className="p-2 text-center min-w-[200px]"
                        >
                          {property.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <CompareTableBody
                      properties={propertiesToCompare}
                      onView={handleView}
                      onClose={() => setShowCompareDialog(false)}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
