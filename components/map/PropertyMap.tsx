'use client'

/**
 * Active map: Leaflet + OpenStreetMap (free, no API key).
 * Uses imperative L.map() so React Strict Mode remounts do not hit
 * "Map container is already initialized".
 */

import { useMemo, useState, useCallback, useId, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'
import { AvailabilityBadge } from '@/components/shared/AvailabilityBadge'
import { MapPin, Navigation, ExternalLink, X } from 'lucide-react'
import type { Property } from '@/types/property'
import { toast } from '@/lib/feedback/toast'
import { formatCurrency } from '@/lib/format/locale'

interface PropertyMapProps {
  properties: Property[]
  onPropertyClick?: (property: Property) => void
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
}

const defaultCenter = { lat: 23.6850, lng: 90.3563 } // Bangladesh centroid (near Dhaka)
const defaultZoom = 7 // country-level view

/** Approximate Bangladesh bounding box (keeps map focused on BD, not neighbors). */
const BD_SOUTH_WEST: L.LatLngTuple = [20.55, 88.0]
const BD_NORTH_EAST: L.LatLngTuple = [26.65, 92.7]

function bangladeshBounds() {
  return L.latLngBounds(BD_SOUTH_WEST, BD_NORTH_EAST)
}

function isInBangladesh(lat: number, lng: number) {
  return bangladeshBounds().contains([lat, lng])
}

function pinIcon(available: boolean) {
  const fill = available ? '#3B82F6' : '#9CA3AF'
  const svg = `<svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="${fill}"/><circle cx="16" cy="16" r="6" fill="white"/></svg>`
  return L.divIcon({
    className: 'sl-property-pin',
    html: svg,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  })
}

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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [mapReady, setMapReady] = useState(false)

  const propertiesWithCoords = useMemo(() => {
    return properties.filter(p => p.latitude != null && p.longitude != null)
  }, [properties])

  const handleGetDirections = useCallback((property: Property) => {
    if (property.latitude == null || property.longitude == null) return
    const { latitude: lat, longitude: lng } = property
    // Google Maps destination link — no API key, no login (OSM /directions often asks to register)
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank',
      'noopener,noreferrer',
    )
  }, [])

  // Create / destroy map once per mount (Strict Mode safe via cleanup)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Clear stale Leaflet id from HMR / interrupted mounts
    const leafletEl = el as HTMLElement & { _leaflet_id?: number }
    if (leafletEl._leaflet_id) {
      el.innerHTML = ''
      delete leafletEl._leaflet_id
    }

    const bdBounds = bangladeshBounds()
    const preferUser =
      center != null &&
      Number.isFinite(center.lat) &&
      Number.isFinite(center.lng) &&
      isInBangladesh(center.lat, center.lng)

    const map = L.map(el, {
      scrollWheelZoom: true,
      attributionControl: true,
      minZoom: 6,
      maxBounds: bdBounds.pad(0.08),
      maxBoundsViscosity: 0.85,
    })

    if (preferUser) {
      map.setView([center.lat, center.lng], Math.max(zoom, 12))
    } else {
      // Default: whole Bangladesh (not India / Myanmar in frame)
      map.fitBounds(bdBounds, { padding: [12, 12], maxZoom: 7 })
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    const markers = L.layerGroup().addTo(map)
    mapRef.current = map
    markersLayerRef.current = markers
    setMapReady(true)

    const t1 = window.setTimeout(() => map.invalidateSize(), 50)
    const t2 = window.setTimeout(() => map.invalidateSize(), 250)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      map.remove()
      mapRef.current = null
      markersLayerRef.current = null
      setMapReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, [])

  // Sync markers when listings change
  useEffect(() => {
    const map = mapRef.current
    const layer = markersLayerRef.current
    if (!map || !layer || !mapReady) return

    layer.clearLayers()
    const bounds: L.LatLngExpression[] = []

    propertiesWithCoords.forEach(property => {
      const latLng: L.LatLngExpression = [
        property.latitude!,
        property.longitude!,
      ]
      // Prefer pins inside Bangladesh for framing the map
      if (isInBangladesh(property.latitude!, property.longitude!)) {
        bounds.push(latLng)
      }

      const marker = L.marker(latLng, {
        icon: pinIcon(!!property.available),
        title: `${property.name} — ${property.area}, ${formatCurrency(property.rent)}/month`,
      })

      marker.on('click', () => {
        setSelectedProperty(property)
      })
      layer.addLayer(marker)
    })

    // If no in-BD pins, still plot markers but keep BD frame
    if (bounds.length === 0 && propertiesWithCoords.length > 0) {
      propertiesWithCoords.forEach(p => {
        bounds.push([p.latitude!, p.longitude!])
      })
    }

    if (bounds.length === 1) {
      map.setView(bounds[0], 14)
    } else if (bounds.length > 1) {
      const propBounds = L.latLngBounds(bounds)
      map.fitBounds(propBounds, { padding: [48, 48], maxZoom: 13 })
      // If pins are country-wide, keep view inside Bangladesh
      if (map.getZoom() < 7) {
        map.fitBounds(bangladeshBounds(), { padding: [12, 12], maxZoom: 7 })
      }
    } else {
      map.fitBounds(bangladeshBounds(), { padding: [12, 12], maxZoom: 7 })
    }

    map.invalidateSize()
  }, [propertiesWithCoords, mapReady])

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const map = mapRef.current
        if (!map) return
        const { latitude: lat, longitude: lng } = position.coords
        if (isInBangladesh(lat, lng)) {
          map.setView([lat, lng], 14)
        } else {
          // App is BD-focused — keep Bangladesh if user is abroad
          map.fitBounds(bangladeshBounds(), { padding: [12, 12], maxZoom: 7 })
          toast.info('Showing Bangladesh — your location is outside the country.')
        }
        map.invalidateSize()
      },
      () => {
        toast.error(
          'Unable to get your location. Please enable location services.',
        )
      },
    )
  }, [])

  const focusProperty = useCallback((property: Property) => {
    setSelectedProperty(property)
    const map = mapRef.current
    if (!map || property.latitude == null || property.longitude == null) return
    map.setView([property.latitude, property.longitude], 15)
    map.invalidateSize()
  }, [])

  const mapHeight = height || '600px'

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

      <div
        className="relative w-full overflow-hidden rounded-md border bg-[#dbe4ee]"
        style={{ height: mapHeight, minHeight: 420 }}
      >
        <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            className="bg-background/95 shadow-sm backdrop-blur"
            aria-label="Center map on my current location"
          >
            <Navigation className="mr-2 h-4 w-4" aria-hidden="true" />
            My Location
          </Button>
        </div>

        {selectedProperty ? (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] mx-auto max-w-sm rounded-lg border bg-background p-3 shadow-lg sm:left-4 sm:right-auto">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold leading-snug">
                  {selectedProperty.name}
                </p>
                <p className="text-xs capitalize text-muted-foreground">
                  {selectedProperty.type}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setSelectedProperty(null)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>
                {selectedProperty.area}, {selectedProperty.city}
              </span>
            </div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-sm font-bold">
                {formatCurrency(selectedProperty.rent)}/month
              </span>
              <AvailabilityBadge available={selectedProperty.available} />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onPropertyClick?.(selectedProperty)}
              >
                View Details
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => handleGetDirections(selectedProperty)}
                aria-label="Get directions"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : null}

        <div
          ref={containerRef}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {propertiesWithCoords.length === 0 ? (
        <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
          No listings with map coordinates yet. Pins appear when properties have
          latitude/longitude.
        </p>
      ) : (
        <div className="rounded-lg border bg-muted/20 p-3">
          <p id={listLabelId} className="mb-2 text-sm font-medium">
            Property list ({propertiesWithCoords.length}) — Tab to browse, Enter
            to select
          </p>
          <ul
            className="max-h-48 space-y-1 overflow-y-auto"
            aria-labelledby={listLabelId}
            role="listbox"
            aria-activedescendant={
              selectedProperty
                ? `map-property-${selectedProperty.id}`
                : undefined
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
                    onClick={() => focusProperty(property)}
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
      )}
    </section>
  )
}
