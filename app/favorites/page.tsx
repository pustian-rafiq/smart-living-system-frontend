'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Textarea } from '@/components/ui/textarea'
import { mockFavorites, getFavoritesByUserId } from '@/data/mockFavorites'
import type { Favorite } from '@/types/favorites'
import { Heart, Share2, Trash2, Search, GitCompare } from 'lucide-react'
import { mockProperties } from '@/data/mockProperties'

export default function FavoritesPage() {
  const router = useRouter()
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([])
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [showCompareDialog, setShowCompareDialog] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'rent' | 'name'>('date')

  // Get current user ID (in real app, this would come from auth)
  const currentUserId = 'user1' // Mock user ID

  const favorites = useMemo(() => {
    const favs = getFavoritesByUserId(currentUserId)
    // Sort favorites
    return favs.sort((a, b) => {
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
  }, [currentUserId, sortBy])

  const handleRemove = (id: string) => {
    if (confirm('Remove this property from favorites?')) {
      // In real app, this would call an API
      const index = mockFavorites.findIndex(fav => fav.id === id)
      if (index > -1) {
        mockFavorites.splice(index, 1)
      }
      setSelectedFavorites(selectedFavorites.filter(favId => favId !== id))
    }
  }

  const handleView = (propertyId: string) => {
    router.push(`/search?propertyId=${propertyId}`)
  }

  const handleShare = (favorite: Favorite) => {
    // Generate shareable URL
    const url = `${window.location.origin}/search?propertyId=${favorite.propertyId}`
    setShareUrl(url)
    setShowShareDialog(true)
  }

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard!')
  }

  const handleToggleSelect = (id: string) => {
    setSelectedFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    )
  }

  const handleCompare = () => {
    if (selectedFavorites.length < 2) {
      alert('Please select at least 2 properties to compare')
      return
    }
    if (selectedFavorites.length > 4) {
      alert('You can compare up to 4 properties at once')
      return
    }
    setShowCompareDialog(true)
  }

  const propertiesToCompare = useMemo(() => {
    return selectedFavorites
      .map(id => {
        const favorite = favorites.find(f => f.id === id)
        if (!favorite) return null
        return mockProperties.find(p => p.id === favorite.propertyId)
      })
      .filter(Boolean)
  }, [selectedFavorites, favorites])

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">My Favorites</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {favorites.length}{' '}
                {favorites.length === 1 ? 'property' : 'properties'} saved
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
                    Compare ({selectedFavorites.length})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFavorites([])}
                  >
                    Clear Selection
                  </Button>
                </>
              )}
              <Button onClick={() => router.push('/search')}>
                <Search className="mr-2 h-4 w-4" />
                Find More
              </Button>
            </div>
          </div>
        </div>

        {/* Sort and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Label>Sort by:</Label>
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
                  <SelectItem value="date">Date Added</SelectItem>
                  <SelectItem value="rent">Rent (Low to High)</SelectItem>
                  <SelectItem value="name">Name (A to Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">
                No favorites yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Save properties you like to view them later
              </p>
              <Button className="mt-4" onClick={() => router.push('/search')}>
                <Search className="mr-2 h-4 w-4" />
                Browse Properties
              </Button>
            </CardContent>
          </Card>
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
                {/* Selection Checkbox */}
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

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Property</DialogTitle>
              <DialogDescription>
                Share this property with others
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Share Link</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={shareUrl} readOnly />
                  <Button onClick={handleCopyShareUrl}>Copy</Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Check out this property',
                        url: shareUrl,
                      })
                    }
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowShareDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Compare Dialog */}
        <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Compare Properties</DialogTitle>
              <DialogDescription>
                Compare {propertiesToCompare.length} properties side by side
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Property</th>
                      {propertiesToCompare.map(property => (
                        <th
                          key={property!.id}
                          className="p-2 text-center min-w-[200px]"
                        >
                          {property!.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Type</td>
                      {propertiesToCompare.map(property => (
                        <td
                          key={property!.id}
                          className="p-2 text-center capitalize"
                        >
                          {property!.type}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Rent</td>
                      {propertiesToCompare.map(property => (
                        <td
                          key={property!.id}
                          className="p-2 text-center font-semibold text-primary"
                        >
                          ৳{property!.rent.toLocaleString()}/month
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Location</td>
                      {propertiesToCompare.map(property => (
                        <td
                          key={property!.id}
                          className="p-2 text-center text-sm"
                        >
                          {property!.area}, {property!.city}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Available</td>
                      {propertiesToCompare.map(property => (
                        <td key={property!.id} className="p-2 text-center">
                          {property!.available ? (
                            <span className="text-green-600">Yes</span>
                          ) : (
                            <span className="text-red-600">No</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Verified</td>
                      {propertiesToCompare.map(property => (
                        <td key={property!.id} className="p-2 text-center">
                          {property!.verified ? (
                            <span className="text-green-600">Yes</span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Facilities</td>
                      {propertiesToCompare.map(property => (
                        <td key={property!.id} className="p-2 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {property!.facilities
                              .slice(0, 3)
                              .map((facility, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-muted px-2 py-1 rounded"
                                >
                                  {facility}
                                </span>
                              ))}
                            {property!.facilities.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{property!.facilities.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Actions</td>
                      {propertiesToCompare.map(property => (
                        <td key={property!.id} className="p-2 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleView(property!.id)
                              setShowCompareDialog(false)
                            }}
                          >
                            View Details
                          </Button>
                        </td>
                      ))}
                    </tr>
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
