'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VerificationBadge } from '@/components/property/VerificationBadge'
import { ImageGallery } from '@/components/property/ImageGallery'
import { VideoPlayer } from '@/components/property/VideoPlayer'
import { Phone, MapPin, Wifi, Car, Shield, Zap, Home, Video, Image as ImageIcon, MessageCircle } from 'lucide-react'
import { BookingForm } from '@/components/booking/BookingForm'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { useRouter } from 'next/navigation'
import type { Property } from '@/types/property'
import type { BookingFormData } from '@/types/booking'

interface PropertyDetailDialogProps {
  property: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRequest?: (property: Property) => void
  onBookingSubmit?: (property: Property, data: BookingFormData & { moveInDate: string; moveOutDate?: string }) => void
  onCall: (phone: string) => void
}

const facilityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Security: <Shield className="h-4 w-4" />,
  Generator: <Zap className="h-4 w-4" />,
  AC: <Zap className="h-4 w-4" />,
  Lift: <Home className="h-4 w-4" />,
}

export function PropertyDetailDialog({
  property,
  open,
  onOpenChange,
  onRequest,
  onBookingSubmit,
  onCall,
}: PropertyDetailDialogProps) {
  const [showBookingForm, setShowBookingForm] = useState(false)
  const router = useRouter()

  const handleStartChat = () => {
    // Navigate to messages page and create/select chat for this property
    router.push(`/messages?propertyId=${property.id}`)
    onOpenChange(false)
  }

  if (!property) return null

  const hasVideos = property.videos && property.videos.length > 0
  const hasImages = property.images && property.images.length > 0

  const handleBookingClick = () => {
    if (onBookingSubmit) {
      setShowBookingForm(true)
    } else if (onRequest) {
      onRequest(property)
    }
  }

  const handleBookingSubmit = async (
    data: BookingFormData & { moveInDate: string; moveOutDate?: string }
  ) => {
    if (onBookingSubmit) {
      await onBookingSubmit(property, data)
      setShowBookingForm(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{property.name}</DialogTitle>
          <DialogDescription className="capitalize">{property.type}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Media Gallery - Images and Videos */}
          {(hasImages || hasVideos) && (
            <Tabs defaultValue={hasVideos ? 'video' : 'images'} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                {hasVideos && (
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Walkthrough
                    {hasVideos && (
                      <Badge variant="secondary" className="ml-1">
                        {property.videos?.length || 0}
                      </Badge>
                    )}
                  </TabsTrigger>
                )}
                {hasImages && (
                  <TabsTrigger value="images" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Photos
                    {hasImages && (
                      <Badge variant="secondary" className="ml-1">
                        {property.images.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Video Tab */}
              {hasVideos && (
                <TabsContent value="video" className="mt-4">
                  <div className="space-y-4">
                    {property.videos?.map((videoUrl, idx) => (
                      <div key={idx} className="space-y-2">
                        {property.videos && property.videos.length > 1 && (
                          <p className="text-sm font-medium text-muted-foreground">
                            Video {idx + 1} of {property.videos.length}
                          </p>
                        )}
                        <VideoPlayer
                          videoUrl={videoUrl}
                          thumbnail={idx === 0 ? property.videoThumbnail : undefined}
                          propertyName={property.name}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Images Tab */}
              {hasImages && (
                <TabsContent value="images" className="mt-4">
                  <ImageGallery
                    images={property.images}
                    propertyName={property.name}
                    startIndex={0}
                  />
                </TabsContent>
              )}
            </Tabs>
          )}

          {/* Fallback if no media */}
          {!hasImages && !hasVideos && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted sm:h-80">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                <span className="text-6xl">🏠</span>
              </div>
            </div>
          )}

          {/* Price and Status */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary sm:text-4xl">
                  ৳{property.rent.toLocaleString()}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={property.available ? 'default' : 'secondary'}>
                {property.available ? 'Available' : 'Occupied'}
              </Badge>
              {property.gender && (
                <Badge variant="outline">
                  {property.gender === 'male' ? 'Male' : property.gender === 'female' ? 'Female' : 'Mixed'}
                </Badge>
              )}
              {(property.verified !== undefined || property.verificationStatus) && (
                <VerificationBadge
                  verified={property.verified}
                  verificationStatus={property.verificationStatus}
                  verifiedAt={property.verifiedAt}
                />
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">{property.address}</p>
              <p className="text-sm text-muted-foreground">
                {property.area}, {property.city}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="mb-2 font-semibold">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Facilities */}
          <div>
            <h4 className="mb-3 font-semibold">Facilities</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.facilities.map((facility, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-md border p-2"
                >
                  {facilityIcons[facility] || <Home className="h-4 w-4" />}
                  <span className="text-sm">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Info */}
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-medium">{property.ownerName}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartChat}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCall(property.ownerPhone)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{property.ownerPhone}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <FavoriteButton
              property={property}
              userId="user1" // In real app, get from auth
              variant="outline"
              size="default"
            />
            <Button
              className="flex-1"
              onClick={handleBookingClick}
              disabled={!property.available}
            >
              {property.type === 'mess' ? 'Book Seat' : 'Book Flat'}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Booking Form */}
      {onBookingSubmit && (
        <BookingForm
          property={property}
          open={showBookingForm}
          onOpenChange={setShowBookingForm}
          onSubmit={handleBookingSubmit}
        />
      )}
    </Dialog>
  )
}
