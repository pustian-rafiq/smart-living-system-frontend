'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { HotelCard } from '@/components/hotel/HotelCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Filter, X, Hotel as HotelIcon } from 'lucide-react'
import { EmptyState, LoadingState } from '@/components/page'
import { fetchHotels } from '@/lib/api/hotels'
import { useMockQuery } from '@/hooks/useMockQuery'
import type { HotelSearchFilters } from '@/types/hotel'

export default function HotelsPage() {
  const t = useTranslations('hotels')
  const tc = useTranslations('common')
  const loadHotels = useCallback(() => fetchHotels(), [])
  const { data: hotels, loading } = useMockQuery(loadHotels)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<HotelSearchFilters>({
    city: undefined,
    area: undefined,
    hotelType: 'all',
    minPrice: 0,
    maxPrice: 20000,
    minRating: 0,
    amenities: [],
    roomType: 'all',
    guests: 1,
  })
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [ratingRange, setRatingRange] = useState([0, 5])

  const filteredHotels = useMemo(() => {
    let filtered = [...(hotels ?? [])]

    if (filters.city) {
      filtered = filtered.filter(h =>
        h.city.toLowerCase().includes(filters.city!.toLowerCase())
      )
    }

    if (filters.area) {
      filtered = filtered.filter(h =>
        h.area.toLowerCase().includes(filters.area!.toLowerCase())
      )
    }

    if (filters.hotelType && filters.hotelType !== 'all') {
      filtered = filtered.filter(h => h.type === filters.hotelType)
    }

    if (filters.minPrice !== undefined) {
      // Filter by minimum room price (using base price from rooms)
      filtered = filtered.filter(h => {
        // In real app, check room prices
        return true // Simplified for now
      })
    }

    if (filters.minRating !== undefined && filters.minRating > 0) {
      filtered = filtered.filter(h => h.averageRating >= filters.minRating!)
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(h =>
        filters.amenities!.some(amenity => h.amenities.includes(amenity))
      )
    }

    return filtered
  }, [filters, hotels])

  const handleResetFilters = () => {
    setFilters({
      city: undefined,
      area: undefined,
      hotelType: 'all',
      minPrice: 0,
      maxPrice: 20000,
      minRating: 0,
      amenities: [],
      roomType: 'all',
      guests: 1,
    })
    setPriceRange([0, 20000])
    setRatingRange([0, 5])
  }

  const cities = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', "Cox's Bazar"]
  const areas = [
    'Gulshan',
    'Dhanmondi',
    'Banani',
    'Uttara',
    'Mirpur',
    'Mohammadpur',
  ]
  const amenities = [
    'WiFi',
    'AC',
    'Parking',
    'Restaurant',
    'Gym',
    'Swimming Pool',
    'Spa',
  ]

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <LoadingState label={t('browse.pageTitle')} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {t('browse.pageTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('browse.pageDescription')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">{tc('filters')}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* City */}
                  <div>
                    <Label>{t('browse.filters.city')}</Label>
                    <Select
                      value={filters.city || 'all'}
                      onValueChange={value =>
                        setFilters({
                          ...filters,
                          city: value === 'all' ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('browse.filters.selectCity')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t('browse.filters.allCities')}
                        </SelectItem>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area */}
                  <div>
                    <Label>{t('browse.filters.area')}</Label>
                    <Select
                      value={filters.area || 'all'}
                      onValueChange={value =>
                        setFilters({
                          ...filters,
                          area: value === 'all' ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('browse.filters.selectArea')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t('browse.filters.allAreas')}
                        </SelectItem>
                        {areas.map(area => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Hotel Type */}
                  <div>
                    <Label>{t('browse.filters.hotelType')}</Label>
                    <Select
                      value={filters.hotelType || 'all'}
                      onValueChange={value =>
                        setFilters({ ...filters, hotelType: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t('browse.filters.allTypes')}
                        </SelectItem>
                        <SelectItem value="hotel">
                          {t('browse.filters.hotel')}
                        </SelectItem>
                        <SelectItem value="guest-house">
                          {t('browse.filters.guestHouse')}
                        </SelectItem>
                        <SelectItem value="resort">
                          {t('browse.filters.resort')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label>
                      {t('browse.filters.minimumRating', {
                        rating: ratingRange[0],
                      })}
                    </Label>
                    <Slider
                      value={ratingRange}
                      onValueChange={value => {
                        setRatingRange(value)
                        setFilters({ ...filters, minRating: value[0] })
                      }}
                      min={0}
                      max={5}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label>
                      {t('browse.filters.priceRangeLabel', {
                        min: priceRange[0],
                        max: priceRange[1],
                      })}
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={value => {
                        setPriceRange(value)
                        setFilters({
                          ...filters,
                          minPrice: value[0],
                          maxPrice: value[1],
                        })
                      }}
                      min={0}
                      max={20000}
                      step={500}
                      className="mt-2"
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label>{t('browse.filters.amenities')}</Label>
                    <div className="space-y-2 mt-2">
                      {amenities.map(amenity => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <Switch
                            checked={
                              filters.amenities?.includes(amenity) || false
                            }
                            onCheckedChange={checked => {
                              const current = filters.amenities || []
                              setFilters({
                                ...filters,
                                amenities: checked
                                  ? [...current, amenity]
                                  : current.filter(a => a !== amenity),
                              })
                            }}
                          />
                          <Label className="text-sm font-normal">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResetFilters}
                  >
                    {tc('resetFilters')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <p className="text-sm text-muted-foreground">
                {t('browse.found', { count: filteredHotels.length })}
              </p>
              <Button variant="outline" onClick={() => setShowFilters(true)}>
                <Filter className="mr-2 h-4 w-4" />
                {tc('filters')}
              </Button>
            </div>

            {/* Desktop Results Header */}
            <div className="mb-4 hidden lg:block">
              <p className="text-sm text-muted-foreground">
                {t('browse.found', { count: filteredHotels.length })}
              </p>
            </div>

            {/* Hotel List */}
            {filteredHotels.length === 0 ? (
              <EmptyState
                icon={HotelIcon}
                title={t('browse.emptyTitle')}
                description={t('browse.emptyDesc')}
              >
                <Button variant="outline" onClick={handleResetFilters}>
                  {tc('resetFilters')}
                </Button>
              </EmptyState>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredHotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
