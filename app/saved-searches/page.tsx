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
import { SavedSearchCard } from '@/components/search/SavedSearchCard'
import { SaveSearchDialog } from '@/components/search/SaveSearchDialog'
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
  mockSavedSearches,
  getSavedSearchesByUserId,
  getActiveSavedSearches,
} from '@/data/mockSavedSearches'
import type { SavedSearch } from '@/types/savedSearch'
import { Search, Bell, BellOff, Plus } from 'lucide-react'

export default function SavedSearchesPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'inactive'>(
    'all'
  )
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editName, setEditName] = useState('')

  // Get current user ID (in real app, this would come from auth)
  const currentUserId = 'user1' // Mock user ID

  const allSearches = useMemo(() => {
    return getSavedSearchesByUserId(currentUserId)
  }, [currentUserId])

  const activeSearches = useMemo(() => {
    return getActiveSavedSearches(currentUserId)
  }, [currentUserId])

  const inactiveSearches = useMemo(() => {
    return allSearches.filter(search => !search.isActive)
  }, [allSearches])

  const handleToggle = (id: string, isActive: boolean) => {
    // In real app, this would call an API
    const search = mockSavedSearches.find(s => s.id === id)
    if (search) {
      search.isActive = isActive
      search.updatedAt = new Date().toISOString()
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this saved search?')) {
      // In real app, this would call an API
      const index = mockSavedSearches.findIndex(s => s.id === id)
      if (index > -1) {
        mockSavedSearches.splice(index, 1)
      }
    }
  }

  const handleEdit = (savedSearch: SavedSearch) => {
    setEditingSearch(savedSearch)
    setEditName(savedSearch.name)
    setShowEditDialog(true)
  }

  const handleSaveEdit = () => {
    if (editingSearch && editName.trim()) {
      // In real app, this would call an API
      editingSearch.name = editName.trim()
      editingSearch.updatedAt = new Date().toISOString()
      setShowEditDialog(false)
      setEditingSearch(null)
      setEditName('')
    }
  }

  const handleSearch = (savedSearch: SavedSearch) => {
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
  }

  const getSearchesForTab = () => {
    switch (selectedTab) {
      case 'active':
        return activeSearches
      case 'inactive':
        return inactiveSearches
      default:
        return allSearches
    }
  }

  const searches = getSearchesForTab()

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Saved Searches</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your saved search criteria and get notified of new
                matches
              </p>
            </div>
            <Button onClick={() => router.push('/search')}>
              <Plus className="mr-2 h-4 w-4" />
              New Search
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Searches
                  </p>
                  <p className="text-2xl font-bold">{allSearches.length}</p>
                </div>
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active
                  </p>
                  <p className="text-2xl font-bold">{activeSearches.length}</p>
                </div>
                <Bell className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Inactive
                  </p>
                  <p className="text-2xl font-bold">
                    {inactiveSearches.length}
                  </p>
                </div>
                <BellOff className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={value =>
            setSelectedTab(value as 'all' | 'active' | 'inactive')
          }
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              All ({allSearches.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Active ({activeSearches.length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              <BellOff className="h-4 w-4" />
              Inactive ({inactiveSearches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {allSearches.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    No saved searches
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    Save your search criteria to get notified when new
                    properties match
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push('/search')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Saved Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allSearches.map(search => (
                  <SavedSearchCard
                    key={search.id}
                    savedSearch={search}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onSearch={handleSearch}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {activeSearches.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    No active searches
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    Enable notifications on your saved searches to get updates
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeSearches.map(search => (
                  <SavedSearchCard
                    key={search.id}
                    savedSearch={search}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onSearch={handleSearch}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="mt-6">
            {inactiveSearches.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    No inactive searches
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inactiveSearches.map(search => (
                  <SavedSearchCard
                    key={search.id}
                    savedSearch={search}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onSearch={handleSearch}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Saved Search</DialogTitle>
              <DialogDescription>
                Update the name of your saved search
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Search Name</Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Enter search name"
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowEditDialog(false)
                    setEditingSearch(null)
                    setEditName('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveEdit}
                  disabled={!editName.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
