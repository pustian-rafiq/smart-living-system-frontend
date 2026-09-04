'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Building2, Hotel, Sparkles, UtensilsCrossed } from 'lucide-react'
import {
  DiscoverGrid,
  DiscoverSection,
} from '@/components/discover/DiscoverSection'
import { DiscoverGridSkeleton } from '@/components/discover/DiscoverCardSkeleton'
import { PropertyCard } from '@/components/property/PropertyCard'
import { HotelCard } from '@/components/hotel/HotelCard'
import { MessPublicCard } from '@/components/mess/MessPublicCard'
import { EmptyState } from '@/components/page'
import { useDiscoverCatalog } from '@/hooks/useDiscoverCatalog'
import { isListingFeatured } from '@/components/monetization/FeaturedBadge'
import type { Property } from '@/types/property'

function newestFirst(properties: Property[]) {
  return [...properties].sort((a, b) => {
    const ta = new Date(a.createdAt || a.updatedAt || 0).getTime()
    const tb = new Date(b.createdAt || b.updatedAt || 0).getTime()
    return tb - ta
  })
}

export function LiveMarketplaceSection() {
  const t = useTranslations('home.live')
  const router = useRouter()
  const { featured, properties, hotels, messes, feed, refetchAll, loading } =
    useDiscoverCatalog({ featuredLimit: 6 })

  const onViewDetails = (property: Property) => {
    router.push(`/listings/${property.id}`)
  }
  const onCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const featuredList =
    feed.data?.featured?.length ? feed.data.featured : (featured.data ?? [])
  const apartments = useMemo(() => {
    if (feed.data?.apartments?.length) return feed.data.apartments.slice(0, 6)
    const list = (properties.data ?? []).filter(p => p.type === 'apartment')
    const boosted = list.filter(isListingFeatured)
    const rest = newestFirst(list.filter(p => !isListingFeatured(p)))
    return [...boosted, ...rest].slice(0, 6)
  }, [feed.data, properties.data])

  const newListings = useMemo(() => {
    if (feed.data?.newThisWeek?.length) return feed.data.newThisWeek.slice(0, 6)
    return newestFirst(properties.data ?? []).slice(0, 6)
  }, [feed.data, properties.data])

  const openMesses = useMemo(() => {
    if (feed.data?.messes?.length) return feed.data.messes.slice(0, 6)
    return (messes.data ?? []).filter(m => m.availableSeats > 0).slice(0, 6)
  }, [feed.data, messes.data])

  const hotelList = feed.data?.hotels?.length
    ? feed.data.hotels.slice(0, 6)
    : (hotels.data ?? []).slice(0, 6)

  return (
    <div className="bg-muted/20">
      <DiscoverSection
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        href="/search"
        hrefLabel={t('viewAll')}
        onRefresh={refetchAll}
        refreshing={loading}
      >
        <p className="mb-8 text-xs text-muted-foreground">{t('freshHint')}</p>

        <div className="space-y-12">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-primary" />
              {t('featuredTitle')}
            </h3>
            {featured.loading ? (
              <DiscoverGridSkeleton count={3} />
            ) : featuredList.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title={t('emptyFeaturedTitle')}
                description={t('emptyFeaturedDesc')}
              />
            ) : (
              <DiscoverGrid>
                {featuredList.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={onViewDetails}
                    onCall={onCall}
                  />
                ))}
              </DiscoverGrid>
            )}
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              {t('messTitle')}
            </h3>
            {messes.loading ? (
              <DiscoverGridSkeleton count={3} />
            ) : openMesses.length === 0 ? (
              <EmptyState
                icon={UtensilsCrossed}
                title={t('emptyMessTitle')}
                description={t('emptyMessDesc')}
              />
            ) : (
              <DiscoverGrid>
                {openMesses.map(mess => (
                  <MessPublicCard key={mess.id} mess={mess} />
                ))}
              </DiscoverGrid>
            )}
            <div className="mt-4 text-right">
              <a
                href="/messes"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t('browseMess')} →
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Hotel className="h-5 w-5 text-primary" />
              {t('hotelsTitle')}
            </h3>
            {hotels.loading ? (
              <DiscoverGridSkeleton count={3} />
            ) : hotelList.length === 0 ? (
              <EmptyState
                icon={Hotel}
                title={t('emptyHotelsTitle')}
                description={t('emptyHotelsDesc')}
              />
            ) : (
              <DiscoverGrid>
                {hotelList.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </DiscoverGrid>
            )}
            <div className="mt-4 text-right">
              <a
                href="/hotels"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t('browseHotels')} →
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Building2 className="h-5 w-5 text-primary" />
              {t('apartmentsTitle')}
            </h3>
            {properties.loading ? (
              <DiscoverGridSkeleton count={3} />
            ) : apartments.length === 0 ? (
              <EmptyState
                icon={Building2}
                title={t('emptyApartmentsTitle')}
                description={t('emptyApartmentsDesc')}
              />
            ) : (
              <DiscoverGrid>
                {apartments.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={onViewDetails}
                    onCall={onCall}
                  />
                ))}
              </DiscoverGrid>
            )}
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('newTitle')}</h3>
            {properties.loading ? (
              <DiscoverGridSkeleton count={3} />
            ) : newListings.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title={t('emptyNewTitle')}
                description={t('emptyNewDesc')}
              />
            ) : (
              <DiscoverGrid>
                {newListings.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={onViewDetails}
                    onCall={onCall}
                  />
                ))}
              </DiscoverGrid>
            )}
          </div>
        </div>
      </DiscoverSection>
    </div>
  )
}
