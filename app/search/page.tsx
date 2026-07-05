'use client'

import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyDetailDialog } from '@/components/property/PropertyDetailDialog'
import { PropertyMap } from '@/components/map/PropertyMap'
import { BookingConfirmation } from '@/components/booking/BookingConfirmation'
import { CompareBar } from '@/components/property/CompareBar'
import { SaveSearchDialog } from '@/components/search/SaveSearchDialog'
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Map,
  List,
  Navigation,
  MapPin,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react'
import {
  getPublishedProperties,
  getCities,
  getAreasByCity,
  getAllNearbyFacilities,
} from '@/data/mockProperties'
import '@/data/mockReviews'
import {
  calculateDistance,
  getCurrentLocation,
  formatDistance,
} from '@/utils/location'
import { createBooking } from '@/lib/api/bookings'
import { mockSavedSearches } from '@/data/mockSavedSearches'
import { addSearchHistory } from '@/data/mockSearchHistory'
import type {
  Property,
  PropertyType,
  Gender,
  SeatType,
  MealPlan,
  FurnishingStatus,
  SearchFilters,
} from '@/types/property'
import type { BookingFormData, Booking } from '@/types/booking'

const searchSchema = z.object({
  propertyType: z.enum(['all', 'mess', 'apartment', 'hostel', 'hotel']),
  city: z.string().optional(),
  area: z.string().optional(),
  rentRange: z.tuple([z.number(), z.number()]),
  availableOnly: z.boolean(),
  gender: z.enum(['male', 'female', 'mixed']).nullable(),
  seatType: z.enum(['single', 'shared']).nullable(),
  mealIncluded: z.boolean().optional(),
  mealPlan: z.enum(['breakfast', 'lunch', 'dinner', 'all']).nullable(),
  nearbyFacilities: z.array(z.string()).optional(),
  buildingAge: z.number().optional(),
  floorLevel: z.number().optional(),
  furnishing: z.enum(['furnished', 'unfurnished', 'semi-furnished']).nullable(),
  parking: z.boolean().optional(),
  security: z.boolean().optional(),
  verifiedOnly: z.boolean().optional(),
})

type SearchFormData = z.infer<typeof searchSchema>

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [lastBooking, setLastBooking] = useState<Booking | null>(null)
  const [showSaveSearchDialog, setShowSaveSearchDialog] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [availableAreas, setAvailableAreas] = useState<string[]>([])
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [searchByLocation, setSearchByLocation] = useState(false)
  const [searchRadius, setSearchRadius] = useState(10) // in km
  const [locationLoading, setLocationLoading] = useState(false)
  const [compareList, setCompareList] = useState<Property[]>([])
  const [bookingError, setBookingError] = useState<string | null>(null)

  const cities = getCities()
  const allNearbyFacilities = getAllNearbyFacilities()

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      propertyType: 'all',
      city: undefined,
      area: undefined,
      rentRange: [2000, 20000],
      availableOnly: true,
      gender: null,
      seatType: null,
      mealIncluded: undefined,
      mealPlan: null,
      nearbyFacilities: [],
      buildingAge: undefined,
      floorLevel: undefined,
      furnishing: null,
      parking: undefined,
      security: undefined,
      verifiedOnly: false,
    },
  })

  const { watch, setValue, handleSubmit, reset } = form
  const formValues = watch()

  // Handle get current location
  const handleGetCurrentLocation = async () => {
    setLocationLoading(true)
    const location = await getCurrentLocation()
    if (location) {
      setUserLocation(location)
      setSearchByLocation(true)
    } else {
      alert('Unable to get your location. Please enable location services.')
    }
    setLocationLoading(false)
  }

  // Update available areas when city changes
  useEffect(() => {
    if (selectedCity && selectedCity !== 'all') {
      const areas = getAreasByCity(selectedCity)
      setAvailableAreas(areas)
      // Reset area if current area is not in new city
      if (formValues.area && !areas.includes(formValues.area)) {
        setValue('area', undefined)
      }
    } else {
      setAvailableAreas([])
      setValue('area', undefined)
    }
  }, [selectedCity, formValues.area, setValue])

  // Filter properties based on form values
  const filteredProperties = useMemo(() => {
    let filtered = [...getPublishedProperties()]

    // Filter by type
    if (formValues.propertyType !== 'all') {
      filtered = filtered.filter(p => p.type === formValues.propertyType)
    }

    // Filter by city
    if (formValues.city) {
      filtered = filtered.filter(p => p.city === formValues.city)
    }

    // Filter by area
    if (formValues.area) {
      filtered = filtered.filter(p => p.area === formValues.area)
    }

    // Filter by rent range
    filtered = filtered.filter(
      p =>
        p.rent >= formValues.rentRange[0] && p.rent <= formValues.rentRange[1]
    )

    // Filter by availability
    if (formValues.availableOnly) {
      filtered = filtered.filter(p => p.available)
    }

    // Filter by gender (for mess/hostel)
    if (
      formValues.gender &&
      (formValues.propertyType === 'mess' ||
        formValues.propertyType === 'hostel' ||
        formValues.propertyType === 'all')
    ) {
      filtered = filtered.filter(
        p =>
          (p.type === 'mess' || p.type === 'hostel') &&
          (p.gender === formValues.gender || p.gender === 'mixed')
      )
    }

    // Filter by seat type (for mess/hostel)
    if (
      formValues.seatType &&
      (formValues.propertyType === 'mess' ||
        formValues.propertyType === 'hostel' ||
        formValues.propertyType === 'all')
    ) {
      filtered = filtered.filter(
        p =>
          (p.type === 'mess' || p.type === 'hostel') &&
          p.seatType === formValues.seatType
      )
    }

    // Filter by meal included (for mess)
    if (
      formValues.mealIncluded !== undefined &&
      (formValues.propertyType === 'mess' || formValues.propertyType === 'all')
    ) {
      filtered = filtered.filter(
        p => p.type === 'mess' && p.mealIncluded === formValues.mealIncluded
      )
    }

    // Filter by meal plan (for mess)
    if (
      formValues.mealPlan &&
      (formValues.propertyType === 'mess' || formValues.propertyType === 'all')
    ) {
      filtered = filtered.filter(
        p => p.type === 'mess' && p.mealPlan === formValues.mealPlan
      )
    }

    // Filter by nearby facilities
    if (formValues.nearbyFacilities && formValues.nearbyFacilities.length > 0) {
      filtered = filtered.filter(p =>
        formValues.nearbyFacilities!.some(facility =>
          p.nearbyFacilities?.includes(facility)
        )
      )
    }

    // Filter by building age
    if (formValues.buildingAge !== undefined) {
      filtered = filtered.filter(
        p => p.buildingAge && p.buildingAge <= formValues.buildingAge!
      )
    }

    // Filter by floor level
    if (formValues.floorLevel !== undefined) {
      filtered = filtered.filter(
        p => p.floorLevel && p.floorLevel <= formValues.floorLevel!
      )
    }

    // Filter by furnishing
    if (formValues.furnishing) {
      filtered = filtered.filter(p => p.furnishing === formValues.furnishing)
    }

    // Filter by parking
    if (formValues.parking !== undefined) {
      filtered = filtered.filter(p => p.parking === formValues.parking)
    }

    // Filter by security
    if (formValues.security !== undefined) {
      filtered = filtered.filter(p => p.security === formValues.security)
    }

    // Filter by verified only
    if (formValues.verifiedOnly) {
      filtered = filtered.filter(
        p => p.verified === true || p.verificationStatus === 'verified'
      )
    }

    // Filter by location/radius if enabled
    if (searchByLocation && userLocation) {
      filtered = filtered.filter(p => {
        if (!p.latitude || !p.longitude) return false
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          p.latitude,
          p.longitude
        )
        return distance <= searchRadius
      })
    }

    return filtered
  }, [formValues, searchByLocation, userLocation, searchRadius])

  // Save search to history when filters change (after filtering is done)
  useEffect(() => {
    // Only save if there are meaningful filters and we have results
    const hasFilters =
      formValues.propertyType !== 'all' ||
      formValues.city ||
      formValues.area ||
      formValues.rentRange[0] !== 2000 ||
      formValues.rentRange[1] !== 20000 ||
      formValues.availableOnly ||
      formValues.verifiedOnly ||
      formValues.gender ||
      formValues.seatType ||
      formValues.mealIncluded ||
      formValues.nearbyFacilities?.length ||
      formValues.buildingAge ||
      formValues.floorLevel ||
      formValues.furnishing ||
      formValues.parking ||
      formValues.security

    if (hasFilters && filteredProperties.length > 0) {
      // Debounce: only save after user stops changing filters
      const timer = setTimeout(() => {
        addSearchHistory({
          userId: 'user1', // In real app, get from auth
          filters: formValues,
          resultCount: filteredProperties.length,
        })
      }, 2000) // Wait 2 seconds after last change

      return () => clearTimeout(timer)
    }
  }, [formValues, filteredProperties.length])

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property)
    setIsDialogOpen(true)
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleRequest = (property: Property) => {
    setSelectedProperty(property)
    setIsDialogOpen(true)
  }

  const handleCompareToggle = (property: Property) => {
    setCompareList(prev => {
      if (prev.some(p => p.id === property.id)) {
        return prev.filter(p => p.id !== property.id)
      }
      if (prev.length >= 3) return prev
      return [...prev, property]
    })
  }

  const handleBookingSubmit = async (
    property: Property,
    data: BookingFormData & { moveInDate: string; moveOutDate?: string }
  ) => {
    setBookingError(null)
    const result = await createBooking(property, data)
    if (!result.ok) {
      setBookingError(result.error)
      throw new Error(result.error)
    }
    setLastBooking(result.data)
    setShowBookingConfirmation(true)
    setIsDialogOpen(false)
  }

  const handleReset = () => {
    setSelectedCity('all')
    setUserLocation(null)
    setSearchByLocation(false)
    setSearchRadius(10)
    reset({
      propertyType: 'all',
      city: undefined,
      area: undefined,
      rentRange: [2000, 20000],
      availableOnly: true,
      gender: null,
      seatType: null,
      mealIncluded: undefined,
      mealPlan: null,
      nearbyFacilities: [],
      buildingAge: undefined,
      floorLevel: undefined,
      furnishing: null,
      parking: undefined,
      security: undefined,
      verifiedOnly: false,
    })
  }

  const handleSaveSearch = (
    name: string,
    filters: SearchFilters,
    enableNotifications: boolean
  ) => {
    // In real app, this would call an API
    const newSavedSearch = {
      id: `search-${Date.now()}`,
      userId: 'user1', // In real app, get from auth
      name,
      filters,
      isActive: enableNotifications,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockSavedSearches.push(newSavedSearch)
    // Show success message
    alert(`Search "${name}" saved successfully!`)
  }

  const isSearchSaved = useMemo(() => {
    // Check if current search matches any saved search
    return mockSavedSearches.some(saved => {
      const current = formValues
      return (
        saved.filters.propertyType === current.propertyType &&
        saved.filters.city === current.city &&
        saved.filters.area === current.area &&
        saved.filters.rentRange[0] === current.rentRange[0] &&
        saved.filters.rentRange[1] === current.rentRange[1] &&
        saved.filters.availableOnly === current.availableOnly &&
        saved.filters.verifiedOnly === current.verifiedOnly
      )
    })
  }, [formValues])

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    setValue('city', city === 'all' ? undefined : city)
  }

  const handleNearbyFacilityToggle = (facility: string) => {
    const current = formValues.nearbyFacilities || []
    const updated = current.includes(facility)
      ? current.filter(f => f !== facility)
      : [...current, facility]
    setValue('nearbyFacilities', updated)
  }

  const minRent = 2000
  const maxRent = 20000

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold sm:text-3xl">
                Search Properties
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {filteredProperties.length}{' '}
                {filteredProperties.length === 1 ? 'property' : 'properties'}{' '}
                found
                {searchByLocation && userLocation && (
                  <span className="ml-2 inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    within {formatDistance(searchRadius)}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex rounded-lg border bg-background p-1 shadow-sm">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="mr-1.5 h-4 w-4" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="h-8 px-3"
                >
                  <Map className="mr-1.5 h-4 w-4" />
                  Map
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = '/saved-searches')}
                className="hidden sm:flex"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Saved Searches
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {filteredProperties.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                    {filteredProperties.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters
                ? 'fixed inset-0 z-50 bg-background p-4 overflow-y-auto'
                : 'hidden'
            } lg:relative lg:block lg:w-80 lg:shrink-0`}
          >
            <Card className="h-full border-border/50 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
                <CardTitle className="text-lg font-semibold">Filters</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <form onSubmit={handleSubmit(() => {})} className="space-y-5">
                  {/* City Selection */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">City</Label>
                    <Select
                      value={selectedCity}
                      onValueChange={handleCityChange}
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

                  {/* Area Selection */}
                  {selectedCity &&
                    selectedCity !== 'all' &&
                    availableAreas.length > 0 && (
                      <div className="space-y-2.5">
                        <Label className="text-sm font-semibold">Area</Label>
                        <Select
                          value={formValues.area || 'all'}
                          onValueChange={value =>
                            setValue(
                              'area',
                              value === 'all' ? undefined : value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Areas</SelectItem>
                            {availableAreas.map(area => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                  {/* Property Type */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                      Property Type
                    </Label>
                    <RadioGroup
                      value={formValues.propertyType}
                      onValueChange={(value: PropertyType | 'all') =>
                        setValue('propertyType', value as PropertyType | 'all')
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="type-all" />
                        <Label
                          htmlFor="type-all"
                          className="font-normal cursor-pointer"
                        >
                          All
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mess" id="type-mess" />
                        <Label
                          htmlFor="type-mess"
                          className="font-normal cursor-pointer"
                        >
                          Mess
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apartment" id="type-apartment" />
                        <Label
                          htmlFor="type-apartment"
                          className="font-normal cursor-pointer"
                        >
                          Apartment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hostel" id="type-hostel" />
                        <Label
                          htmlFor="type-hostel"
                          className="font-normal cursor-pointer"
                        >
                          Hostel
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hotel" id="type-hotel" />
                        <Label
                          htmlFor="type-hotel"
                          className="font-normal cursor-pointer"
                        >
                          Hotel
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Rent Range */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">
                        Rent Range
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        ৳{formValues.rentRange[0].toLocaleString()} - ৳
                        {formValues.rentRange[1].toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      value={formValues.rentRange}
                      onValueChange={value =>
                        setValue('rentRange', value as [number, number])
                      }
                      min={minRent}
                      max={maxRent}
                      step={500}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>৳{minRent.toLocaleString()}</span>
                      <span>৳{maxRent.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold">
                        Available Only
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Show only available properties
                      </p>
                    </div>
                    <Switch
                      checked={formValues.availableOnly}
                      onCheckedChange={checked =>
                        setValue('availableOnly', checked)
                      }
                    />
                  </div>

                  {/* Verified Only Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold">
                        Verified Only
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Show only verified properties
                      </p>
                    </div>
                    <Switch
                      checked={formValues.verifiedOnly || false}
                      onCheckedChange={checked =>
                        setValue('verifiedOnly', checked)
                      }
                    />
                  </div>

                  {/* Gender (for Mess/Hostel) */}
                  {(formValues.propertyType === 'mess' ||
                    formValues.propertyType === 'hostel' ||
                    formValues.propertyType === 'all') && (
                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold">Gender</Label>
                      <Select
                        value={formValues.gender || 'all'}
                        onValueChange={value =>
                          setValue(
                            'gender',
                            value === 'all' ? null : (value as Gender)
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Seat Type (for Mess/Hostel) */}
                  {(formValues.propertyType === 'mess' ||
                    formValues.propertyType === 'hostel' ||
                    formValues.propertyType === 'all') && (
                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold">Seat Type</Label>
                      <Select
                        value={formValues.seatType || 'all'}
                        onValueChange={value =>
                          setValue(
                            'seatType',
                            value === 'all' ? null : (value as SeatType)
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select seat type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="shared">Shared</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Meal Included (for Mess) */}
                  {formValues.propertyType === 'mess' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">
                          Meal Included
                        </Label>
                        <Switch
                          checked={formValues.mealIncluded || false}
                          onCheckedChange={checked =>
                            setValue('mealIncluded', checked)
                          }
                        />
                      </div>
                      {formValues.mealIncluded && (
                        <Select
                          value={formValues.mealPlan || 'all'}
                          onValueChange={value =>
                            setValue(
                              'mealPlan',
                              value === 'all' ? null : (value as MealPlan)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Meals</SelectItem>
                            <SelectItem value="breakfast">
                              Breakfast Only
                            </SelectItem>
                            <SelectItem value="lunch">Lunch Only</SelectItem>
                            <SelectItem value="dinner">Dinner Only</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}

                  {/* Location-based Search */}
                  <div className="space-y-3 border-t pt-5">
                    <Label className="text-sm font-semibold">
                      Location Search
                    </Label>
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGetCurrentLocation}
                        disabled={locationLoading}
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        {locationLoading
                          ? 'Getting Location...'
                          : 'Use My Location'}
                      </Button>
                      {userLocation && (
                        <div className="space-y-2 rounded border p-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Search Radius:
                            </span>
                            <span className="font-medium">
                              {formatDistance(searchRadius)}
                            </span>
                          </div>
                          <Slider
                            value={[searchRadius]}
                            onValueChange={value => setSearchRadius(value[0])}
                            min={1}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>1km</span>
                            <span>50km</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="searchByLocation"
                              checked={searchByLocation}
                              onChange={e =>
                                setSearchByLocation(e.target.checked)
                              }
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label
                              htmlFor="searchByLocation"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Filter by distance
                            </Label>
                          </div>
                          {searchByLocation && (
                            <p className="text-xs text-muted-foreground">
                              Showing properties within{' '}
                              {formatDistance(searchRadius)} of your location
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Advanced Filters Toggle */}
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <span className="font-semibold">Advanced Filters</span>
                    {showAdvancedFilters ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Advanced Filters */}
                  {showAdvancedFilters && (
                    <div className="space-y-5 border-t pt-5">
                      {/* Nearby Facilities */}
                      <div className="space-y-2.5">
                        <Label className="text-sm font-semibold">
                          Nearby Facilities
                        </Label>
                        <div className="space-y-2">
                          {allNearbyFacilities.map(facility => (
                            <div
                              key={facility}
                              className="flex items-center space-x-2"
                            >
                              <Switch
                                checked={
                                  formValues.nearbyFacilities?.includes(
                                    facility
                                  ) || false
                                }
                                onCheckedChange={() =>
                                  handleNearbyFacilityToggle(facility)
                                }
                              />
                              <Label className="text-sm font-normal cursor-pointer">
                                {facility}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Building Age */}
                      <div className="space-y-2.5">
                        <Label className="text-sm font-semibold">
                          Building Age (Max: {formValues.buildingAge || 'Any'}{' '}
                          years)
                        </Label>
                        <Slider
                          value={[formValues.buildingAge || 50]}
                          onValueChange={value =>
                            setValue(
                              'buildingAge',
                              value[0] === 50 ? undefined : value[0]
                            )
                          }
                          min={0}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Floor Level */}
                      <div className="space-y-2.5">
                        <Label className="text-sm font-semibold">
                          Floor Level (Max: {formValues.floorLevel || 'Any'})
                        </Label>
                        <Slider
                          value={[formValues.floorLevel || 20]}
                          onValueChange={value =>
                            setValue(
                              'floorLevel',
                              value[0] === 20 ? undefined : value[0]
                            )
                          }
                          min={0}
                          max={20}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Furnishing */}
                      <div className="space-y-2.5">
                        <Label className="text-sm font-semibold">
                          Furnishing
                        </Label>
                        <Select
                          value={formValues.furnishing || 'all'}
                          onValueChange={value =>
                            setValue(
                              'furnishing',
                              value === 'all'
                                ? null
                                : (value as FurnishingStatus)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select furnishing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="furnished">Furnished</SelectItem>
                            <SelectItem value="semi-furnished">
                              Semi-Furnished
                            </SelectItem>
                            <SelectItem value="unfurnished">
                              Unfurnished
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Parking */}
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">
                          Parking Available
                        </Label>
                        <Switch
                          checked={formValues.parking || false}
                          onCheckedChange={checked =>
                            setValue('parking', checked || undefined)
                          }
                        />
                      </div>

                      {/* Security */}
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">
                          Security
                        </Label>
                        <Switch
                          checked={formValues.security || false}
                          onCheckedChange={checked =>
                            setValue('security', checked || undefined)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Save Search Button */}
                  <Button
                    type="button"
                    variant={isSearchSaved ? 'default' : 'outline'}
                    onClick={() => setShowSaveSearchDialog(true)}
                    className="w-full"
                  >
                    {isSearchSaved ? (
                      <>
                        <BookmarkCheck className="mr-2 h-4 w-4" />
                        Search Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="mr-2 h-4 w-4" />
                        Save Search
                      </>
                    )}
                  </Button>

                  {/* Reset Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {filteredProperties.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Filter className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    No properties found
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                    Try adjusting your filters or search criteria to find more
                    results
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="mt-6"
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            ) : viewMode === 'list' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProperties.map(property => {
                  // Calculate distance if location search is enabled
                  let distance: string | undefined
                  if (
                    searchByLocation &&
                    userLocation &&
                    property.latitude &&
                    property.longitude
                  ) {
                    const dist = calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      property.latitude,
                      property.longitude
                    )
                    distance = formatDistance(dist)
                  }

                  return (
                    <div key={property.id} className="relative">
                      <PropertyCard
                        property={property}
                        onViewDetails={handleViewDetails}
                        onCall={handleCall}
                        compareSelected={compareList.some(
                          p => p.id === property.id
                        )}
                        onCompareToggle={handleCompareToggle}
                        compareDisabled={
                          compareList.length >= 3 &&
                          !compareList.some(p => p.id === property.id)
                        }
                      />
                      {distance && (
                        <div className="absolute bottom-[7.5rem] left-3 z-10 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-md backdrop-blur-sm">
                          <MapPin className="mr-1 inline h-3 w-3" />
                          {distance}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <PropertyMap
                    properties={filteredProperties}
                    onPropertyClick={handleViewDetails}
                    center={userLocation || undefined}
                    height="calc(100vh - 300px)"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Property Detail Dialog */}
        <PropertyDetailDialog
          property={selectedProperty}
          open={isDialogOpen}
          onOpenChange={open => {
            setIsDialogOpen(open)
            if (!open) setBookingError(null)
          }}
          onRequest={handleRequest}
          onBookingSubmit={handleBookingSubmit}
          onCall={handleCall}
          bookingError={bookingError}
        />

        {/* Booking Confirmation */}
        <BookingConfirmation
          booking={lastBooking}
          open={showBookingConfirmation}
          onOpenChange={setShowBookingConfirmation}
          onViewBookings={() => {
            window.location.href = '/my-bookings'
          }}
        />

        {/* Save Search Dialog */}
        <SaveSearchDialog
          open={showSaveSearchDialog}
          onOpenChange={setShowSaveSearchDialog}
          filters={formValues}
          onSave={handleSaveSearch}
        />

        <CompareBar
          selected={compareList}
          onRemove={id =>
            setCompareList(prev => prev.filter(p => p.id !== id))
          }
          onClear={() => setCompareList([])}
        />
      </div>
    </Layout>
  )
}
