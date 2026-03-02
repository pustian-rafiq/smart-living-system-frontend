'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { HotelCard } from '@/components/hotel/HotelCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Filter, X } from 'lucide-react'
import { mockHotels } from '@/data/mockHotels'
import type { Hotel, HotelSearchFilters } from '@/types/hotel'

export default function HotelsPage() {
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
    let filtered = [...mockHotels]

    if (filters.city) {
      filtered = filtered.filter(h => h.city.toLowerCase().includes(filters.city!.toLowerCase()))
    }

    if (filters.area) {
      filtered = filtered.filter(h => h.area.toLowerCase().includes(filters.area!.toLowerCase()))
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
  }, [filters])

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

  const cities = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Cox\'s Bazar']
  const areas = ['Gulshan', 'Dhanmondi', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur']
  const amenities = ['WiFi', 'AC', 'Parking', 'Restaurant', 'Gym', 'Swimming Pool', 'Spa']

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Find Hotels & Guest Houses</h1>
          <p className="text-muted-foreground">
            Discover the perfect accommodation for your stay
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Filters</h2>
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
                    <Label>City</Label>
                    <Select
                      value={filters.city || 'all'}
                      onValueChange={(value) =>
                        setFilters({ ...filters, city: value === 'all' ? undefined : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
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
                    <Label>Area</Label>
                    <Select
                      value={filters.area || 'all'}
                      onValueChange={(value) =>
                        setFilters({ ...filters, area: value === 'all' ? undefined : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
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
                    <Label>Hotel Type</Label>
                    <Select
                      value={filters.hotelType || 'all'}
                      onValueChange={(value) =>
                        setFilters({ ...filters, hotelType: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="guest-house">Guest House</SelectItem>
                        <SelectItem value="resort">Resort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label>Minimum Rating: {ratingRange[0]}+</Label>
                    <Slider
                      value={ratingRange}
                      onValueChange={(value) => {
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
                    <Label>Price Range: ৳{priceRange[0]} - ৳{priceRange[1]}</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => {
                        setPriceRange(value)
                        setFilters({ ...filters, minPrice: value[0], maxPrice: value[1] })
                      }}
                      min={0}
                      max={20000}
                      step={500}
                      className="mt-2"
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label>Amenities</Label>
                    <div className="space-y-2 mt-2">
                      {amenities.map(amenity => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Switch
                            checked={filters.amenities?.includes(amenity) || false}
                            onCheckedChange={(checked) => {
                              const current = filters.amenities || []
                              setFilters({
                                ...filters,
                                amenities: checked
                                  ? [...current, amenity]
                                  : current.filter(a => a !== amenity),
                              })
                            }}
                          />
                          <Label className="text-sm font-normal">{amenity}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  <Button variant="outline" className="w-full" onClick={handleResetFilters}>
                    Reset Filters
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
                {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
              </p>
              <Button variant="outline" onClick={() => setShowFilters(true)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Desktop Results Header */}
            <div className="mb-4 hidden lg:block">
              <p className="text-sm text-muted-foreground">
                {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Hotel List */}
            {filteredHotels.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg font-semibold text-muted-foreground">
                    No hotels found
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your filters
                  </p>
                  <Button variant="outline" onClick={handleResetFilters} className="mt-4">
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
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
