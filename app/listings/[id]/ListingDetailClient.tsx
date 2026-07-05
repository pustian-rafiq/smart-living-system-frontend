'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageGallery } from '@/components/property/ImageGallery'
import { VideoPlayer } from '@/components/property/VideoPlayer'
import { VerificationBadge } from '@/components/property/VerificationBadge'
import { ReviewsSection } from '@/components/property/ReviewsSection'
import { PropertyRecommendations } from '@/components/property/PropertyRecommendations'
import { BookingForm } from '@/components/booking/BookingForm'
import { BookingConfirmation } from '@/components/booking/BookingConfirmation'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { RatingDisplay } from '@/components/hotel/RatingDisplay'
import { AvailabilityBadge } from '@/components/shared/AvailabilityBadge'
import { InstantBookBadge } from '@/components/shared/InstantBookBadge'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  fetchPropertyById,
  fetchRecommendations,
} from '@/lib/api/properties'
import {
  createPropertyReview,
  fetchPropertyReviews,
  fetchReviewSummary,
} from '@/lib/api/reviews'
import { createBooking } from '@/lib/api/bookings'
import { getDemoRenterId } from '@/lib/api/demoUser'
import type { Booking, BookingFormData } from '@/types/booking'
import type { Property } from '@/types/property'
import {
  ArrowLeft,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Utensils,
  Video,
  Zap,
} from 'lucide-react'

export function ListingDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [showBooking, setShowBooking] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [lastBooking, setLastBooking] = useState<Booking | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [reviewTick, setReviewTick] = useState(0)

  const loadProperty = useCallback(() => fetchPropertyById(id), [id])
  const loadReviews = useCallback(() => fetchPropertyReviews(id), [id, reviewTick])
  const loadSummary = useCallback(() => fetchReviewSummary(id), [id, reviewTick])
  const loadRecs = useCallback(() => fetchRecommendations(id, 4), [id])

  const {
    data: property,
    loading,
    error,
    refetch,
  } = useMockQuery(loadProperty)
  const { data: reviews } = useMockQuery(loadReviews)
  const { data: summary } = useMockQuery(loadSummary)
  const { data: recommendations } = useMockQuery(loadRecs)

  const onCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`
  }

  const handleBooking = async (
    data: BookingFormData & { moveInDate: string; moveOutDate?: string }
  ) => {
    if (!property) return
    setBookingError(null)
    const result = await createBooking(property, data)
    if (!result.ok) {
      setBookingError(result.error)
      throw new Error(result.error)
    }
    setLastBooking(result.data)
    setShowBooking(false)
    setShowConfirmation(true)
  }

  const handleReview = async (data: {
    rating: number
    comment: string
    stayDurationMonths?: number
  }) => {
    const result = await createPropertyReview(id, data)
    if (!result.ok) throw new Error(result.error)
    setReviewTick(t => t + 1)
    refetch()
  }

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <LoadingState label="Loading listing…" />
        </PageContainer>
      </Layout>
    )
  }

  if (error || !property) {
    return (
      <Layout>
        <PageContainer>
          <EmptyState
            title="Listing not found"
            description={error || 'This property may have been removed.'}
            icon={Home}
          >
            <Button asChild>
              <Link href="/search">Back to search</Link>
            </Button>
          </EmptyState>
        </PageContainer>
      </Layout>
    )
  }

  const bookLabel = property.instantBook
    ? 'Instant book now'
    : property.type === 'mess' || property.type === 'hostel'
      ? 'Request this seat'
      : 'Request this flat'

  return (
    <Layout>
      <PageContainer>
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
          <Link href="/search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search
          </Link>
        </Button>

        <PageHeader
          title={property.name}
          description={`${property.area}, ${property.city} · ${property.type}`}
          actions={
            <div className="flex flex-wrap gap-2">
              <FavoriteButton
                property={property}
                userId={getDemoRenterId()}
                variant="outline"
              />
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/messages?propertyId=${property.id}`)
                }
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat owner
              </Button>
              <Button
                onClick={() => setShowBooking(true)}
                disabled={!property.available}
              >
                {property.instantBook && <Zap className="mr-2 h-4 w-4" />}
                {bookLabel}
              </Button>
            </div>
          }
        />

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <AvailabilityBadge available={property.available} />
          {property.instantBook && (
            <InstantBookBadge tone="soft" label="Instant book" />
          )}
          {property.gender && (
            <Badge variant="outline" className="capitalize">
              {property.gender} only
            </Badge>
          )}
          <VerificationBadge
            verified={property.verified}
            verificationStatus={property.verificationStatus}
            verifiedAt={property.verifiedAt}
          />
          {property.rating != null && property.reviewCount ? (
            <span className="inline-flex items-center gap-1 text-sm">
              <RatingDisplay rating={property.rating} size="sm" />
              <span className="text-muted-foreground">
                ({property.reviewCount} reviews)
              </span>
            </span>
          ) : null}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <Tabs defaultValue="photos">
              <TabsList>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                {property.videos && property.videos.length > 0 && (
                  <TabsTrigger value="video">
                    <Video className="mr-1 h-4 w-4" />
                    Video
                  </TabsTrigger>
                )}
                <TabsTrigger value="reviews">
                  Reviews ({summary?.totalReviews ?? 0})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="photos" className="mt-4">
                <ImageGallery
                  images={property.images}
                  propertyName={property.name}
                />
              </TabsContent>
              {property.videos && property.videos.length > 0 && (
                <TabsContent value="video" className="mt-4 space-y-4">
                  {property.videos.map((url, i) => (
                    <VideoPlayer
                      key={i}
                      videoUrl={url}
                      thumbnail={i === 0 ? property.videoThumbnail : undefined}
                      propertyName={property.name}
                    />
                  ))}
                </TabsContent>
              )}
              <TabsContent value="reviews" className="mt-4">
                <ReviewsSection
                  reviews={reviews || []}
                  summary={
                    summary || {
                      averageRating: 0,
                      totalReviews: 0,
                      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                    }
                  }
                  onSubmitReview={handleReview}
                />
              </TabsContent>
            </Tabs>

            <section>
              <h2 className="mb-2 text-lg font-semibold">About this place</h2>
              <p className="leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">Facilities</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {property.facilities.map(f => (
                  <div
                    key={f}
                    className="rounded-md border px-3 py-2 text-sm"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </section>

            {property.nearbyFacilities && property.nearbyFacilities.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">Nearby</h2>
                <div className="flex flex-wrap gap-2">
                  {property.nearbyFacilities.map(f => (
                    <Badge key={f} variant="secondary">
                      {f}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-semibold">Stay safe in Bangladesh</p>
                  <p className="mt-1 text-muted-foreground">
                    Prefer verified listings, visit in person before paying large
                    deposits, and keep all agreements on the platform. Never
                    transfer money to unknown personal accounts without a
                    receipt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border p-5 shadow-sm">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">
                  ৳{property.rent.toLocaleString()}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {property.mealIncluded && (
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Utensils className="h-3.5 w-3.5" />
                  Meals included
                  {property.mealCost
                    ? ` (+৳${property.mealCost.toLocaleString()})`
                    : ''}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                Deposit: ৳
                {(
                  property.rent *
                  (property.depositMonths ??
                    (property.type === 'apartment' ? 2 : 1))
                ).toLocaleString()}
              </p>

              <div className="mt-4 flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>
                  {property.address}, {property.area}, {property.city}
                </span>
              </div>

              {bookingError && (
                <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {bookingError}
                </p>
              )}

              <Button
                className="mt-4 w-full"
                size="lg"
                disabled={!property.available}
                onClick={() => setShowBooking(true)}
              >
                {property.instantBook && <Zap className="mr-2 h-4 w-4" />}
                {bookLabel}
              </Button>
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => onCall(property.ownerPhone)}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call {property.ownerName}
              </Button>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Listed by</p>
              <p className="font-semibold">{property.ownerName}</p>
              <p className="text-sm text-muted-foreground">
                {property.ownerPhone}
              </p>
            </div>
          </aside>
        </div>

        {recommendations && recommendations.length > 0 && (
          <div className="mt-12">
            <PropertyRecommendations
              properties={recommendations}
              onViewDetails={p => router.push(`/listings/${p.id}`)}
              onCall={onCall}
            />
          </div>
        )}
      </PageContainer>

      <BookingForm
        property={property}
        open={showBooking}
        onOpenChange={setShowBooking}
        onSubmit={handleBooking}
      />
      <BookingConfirmation
        booking={lastBooking}
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onViewBookings={() => {
          setShowConfirmation(false)
          router.push('/my-bookings')
        }}
      />
    </Layout>
  )
}
