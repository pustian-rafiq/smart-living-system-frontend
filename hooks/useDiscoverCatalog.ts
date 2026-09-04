'use client'

import { useCallback, useEffect } from 'react'
import { fetchFeaturedProperties, fetchProperties } from '@/lib/api/properties'
import { fetchHotels } from '@/lib/api/hotels'
import { fetchMessList } from '@/lib/api/mess'
import { fetchDiscoverFeed } from '@/lib/api/discover'
import { useMockQuery } from '@/hooks/useMockQuery'

/**
 * Public live catalog for homepage, search, and browse pages.
 * Refetches when the tab becomes visible so refresh/return shows new owner data.
 */
export function useDiscoverCatalog(options?: { featuredLimit?: number }) {
  const featuredLimit = options?.featuredLimit ?? 6

  const loadFeatured = useCallback(
    () => fetchFeaturedProperties(featuredLimit),
    [featuredLimit],
  )
  const loadProperties = useCallback(() => fetchProperties(), [])
  const loadHotels = useCallback(() => fetchHotels(), [])
  const loadMesses = useCallback(() => fetchMessList(), [])
  const loadFeed = useCallback(
    () => fetchDiscoverFeed(featuredLimit),
    [featuredLimit],
  )

  const featured = useMockQuery(loadFeatured)
  const properties = useMockQuery(loadProperties)
  const hotels = useMockQuery(loadHotels)
  const messes = useMockQuery(loadMesses)
  const feed = useMockQuery(loadFeed)

  const refetchFeatured = featured.refetch
  const refetchProperties = properties.refetch
  const refetchHotels = hotels.refetch
  const refetchMesses = messes.refetch
  const refetchFeed = feed.refetch

  const refetchAll = useCallback(() => {
    void refetchFeatured()
    void refetchProperties()
    void refetchHotels()
    void refetchMesses()
    void refetchFeed()
  }, [
    refetchFeatured,
    refetchFeed,
    refetchHotels,
    refetchMesses,
    refetchProperties,
  ])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refetchAll()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refetchAll])

  const loading =
    featured.loading || properties.loading ||     hotels.loading ||
    messes.loading ||
    feed.loading

  return { featured, properties, hotels, messes, feed, refetchAll, loading }
}
