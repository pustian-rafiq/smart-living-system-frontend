'use client'

import { useMemo, useState, useCallback, useId } from 'react'
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AvailabilityBadge } from '@/components/shared/AvailabilityBadge'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'
import type { Property } from '@/types/property'
import Image from 'next/image'
import { toast } from '@/lib/feedback/toast'
import { formatCurrency } from '@/lib/format/locale'

interface PropertyMapProps {
  properties: Property[]
  onPropertyClick?: (property: Property) => void
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
}

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [
  'places',
]

// Default center (Dhaka, Bangladesh)
const defaultCenter = { lat: 23.8103, lng: 90.4125 }
const defaultZoom = 12

export function PropertyMap({
  properties,
  onPropertyClick,
  center = defaultCenter,
  zoom = defaultZoom,
  height = '600px',
}: PropertyMapProps) {
  const mapLabelId = useId()
  const listLabelId = useId()
  const liveRegionId = useId()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  )
  const [mapCenter, setMapCenter] = useState(center)
  const [mapZoom, setMapZoom] = useState(zoom)

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  // Filter properties with coordinates
  const propertiesWithCoords = useMemo(() => {
    return properties.filter(p => p.latitude && p.longitude)
  }, [properties])

  // Calculate map bounds to fit all properties
  const mapBounds = useMemo(() => {
    if (propertiesWithCoords.length === 0) return undefined

    const lats = propertiesWithCoords.map(p => p.latitude!)
    const lngs = propertiesWithCoords.map(p => p.longitude!)

    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    }
  }, [propertiesWithCoords])

  const handleMarkerClick = useCallback(
    (property: Property) => {
      setSelectedProperty(property)
      if (onPropertyClick) {
        onPropertyClick(property)
      }
    },
    [onPropertyClick]
  )

  const handleUseCurrentLocation = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setMapCenter(newCenter)
          setMapZoom(14)
        },
        () => {
          toast.error(
            'Unable to get your location. Please enable location services.'
          )
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser.')
    }
  }, [])

  const handleGetDirections = useCallback((property: Property) => {
    if (property.latitude && property.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`
      window.open(url, '_blank')
    }
  }, [])

  // Fallback map view if API key is not configured
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || loadError) {
    return (
      <Card role="region" aria-labelledby={mapLabelId}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h2 id={mapLabelId} className="text-lg font-semibold text-muted-foreground">
            Map View Unavailable
          </h2>
          <MapPin className="mb-4 mt-2 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
            {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              ? 'Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.'
              : 'Error loading map. Please check your Google Maps API key configuration.'}
          </p>
          <div className="mt-4 w-full max-w-md space-y-2 text-left text-xs text-muted-foreground">
            <p id={listLabelId}>Properties with locations (keyboard accessible):</p>
            <ul
              className="max-h-64 space-y-2 overflow-y-auto"
              aria-labelledby={listLabelId}
            >
              {propertiesWithCoords.map(property => (
                <li key={property.id} className="rounded border p-2">
                  <p className="font-medium">{property.name}</p>
                  <p className="text-xs">
                    {property.area}, {property.city}
                  </p>
                  {property.latitude && property.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-link text-xs hover:underline"
                    >
                      View on Google Maps →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card role="status" aria-live="polite" aria-busy="true">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div
              className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">Loading map…</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section aria-labelledby={mapLabelId} className="space-y-3">
      <h2 id={mapLabelId} className="sr-only">
        Property map — {propertiesWithCoords.length} listings
      </h2>
      <div
        id={liveRegionId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {selectedProperty
          ? `Selected: ${selectedProperty.name}, ${selectedProperty.area}, ${formatCurrency(selectedProperty.rent)} per month`
          : ''}
      </div>
      <div className="relative w-full" style={{ height }}>
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            className="bg-background/90 backdrop-blur"
            aria-label="Center map on my current location"
          >
            <Navigation className="mr-2 h-4 w-4" aria-hidden="true" />
            My Location
          </Button>
        </div>

        {/* Google Map — visual; keyboard users use list below */}
        <div aria-hidden="true">
          <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={mapZoom}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
        onBoundsChanged={() => {
          // Handle bounds change if needed
        }}
      >
        {/* Property Markers */}
        {propertiesWithCoords.map(property => (
          <Marker
            key={property.id}
            title={`${property.name} — ${property.area}, ${formatCurrency(property.rent)}/month`}
            position={{
              lat: property.latitude!,
              lng: property.longitude!,
            }}
            onClick={() => handleMarkerClick(property)}
            icon={{
              url: property.available
                ? 'data:image/svg+xml;base64,' +
                  btoa(`
                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#3B82F6"/>
                    <circle cx="16" cy="16" r="6" fill="white"/>
                  </svg>
                `)
                : 'data:image/svg+xml;base64,' +
                  btoa(`
                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#9CA3AF"/>
                    <circle cx="16" cy="16" r="6" fill="white"/>
                  </svg>
                `),
              scaledSize: new google.maps.Size(32, 40),
              anchor: new google.maps.Point(16, 40),
            }}
          />
        ))}

        {/* Info Window */}
        {selectedProperty &&
          selectedProperty.latitude &&
          selectedProperty.longitude && (
            <InfoWindow
              position={{
                lat: selectedProperty.latitude,
                lng: selectedProperty.longitude,
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="w-64 p-2">
                <div className="mb-2">
                  {selectedProperty.images[0] && (
                    <div className="relative mb-2 h-32 w-full overflow-hidden rounded">
                      <Image
                        src={selectedProperty.images[0]}
                        alt={selectedProperty.name}
                        fill
                        className="object-cover"
                        sizes="256px"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm">
                    {selectedProperty.name}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedProperty.type}
                  </p>
                </div>
                <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {selectedProperty.area}, {selectedProperty.city}
                  </span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(selectedProperty.rent)}/month
                  </span>
                  <AvailabilityBadge available={selectedProperty.available} />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => {
                      if (onPropertyClick) {
                        onPropertyClick(selectedProperty)
                      }
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => handleGetDirections(selectedProperty)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </InfoWindow>
          )}
      </GoogleMap>
        </div>
      </div>

      {/* Keyboard-accessible property list */}
      <div className="rounded-lg border bg-muted/20 p-3">
        <p id={listLabelId} className="mb-2 text-sm font-medium">
          Property list ({propertiesWithCoords.length}) — use Tab to browse, Enter to select
        </p>
        <ul
          className="max-h-48 space-y-1 overflow-y-auto"
          aria-labelledby={listLabelId}
          role="listbox"
          aria-activedescendant={
            selectedProperty ? `map-property-${selectedProperty.id}` : undefined
          }
        >
          {propertiesWithCoords.map(property => {
            const isSelected = selectedProperty?.id === property.id
            return (
              <li key={property.id} role="presentation">
                <button
                  type="button"
                  id={`map-property-${property.id}`}
                  role="option"
                  aria-selected={isSelected}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => handleMarkerClick(property)}
                >
                  <span>
                    <span className="font-medium">{property.name}</span>
                    <span className="ml-2 text-muted-foreground">
                      {property.area}, {property.city}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatCurrency(property.rent)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
