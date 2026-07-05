'use client'

import { useMemo, useState, useCallback } from 'react'
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
          alert('Unable to get your location. Please enable location services.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
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
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-semibold text-muted-foreground">
            Map View Unavailable
          </p>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
            {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              ? 'Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.'
              : 'Error loading map. Please check your Google Maps API key configuration.'}
          </p>
          <div className="mt-4 space-y-2 text-left text-xs text-muted-foreground">
            <p>Properties with locations:</p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {propertiesWithCoords.map(property => (
                <div key={property.id} className="rounded border p-2">
                  <p className="font-medium">{property.name}</p>
                  <p className="text-xs">
                    {property.area}, {property.city}
                  </p>
                  {property.latitude && property.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-xs text-primary hover:underline"
                    >
                      View on Google Maps →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          className="bg-background/90 backdrop-blur"
        >
          <Navigation className="mr-2 h-4 w-4" />
          My Location
        </Button>
      </div>

      {/* Google Map */}
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
                  <span className="text-sm font-bold text-primary">
                    ৳{selectedProperty.rent.toLocaleString()}/month
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
  )
}
