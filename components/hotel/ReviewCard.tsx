'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { RatingDisplay } from './RatingDisplay'
import { format } from 'date-fns'
import Image from 'next/image'
import { SafeText } from '@/components/security/SafeText'

interface ReviewCardProps {
  review: {
    id: string
    userName: string
    userAvatar?: string
    rating: number
    comment: string
    images?: string[]
    createdAt: string
    ownerResponse?: string
    ownerResponseDate?: string
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold text-sm">{review.userName}</h4>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <RatingDisplay
                rating={review.rating}
                showNumber={false}
                size="sm"
              />
            </div>

            <SafeText as="p" className="text-sm text-foreground mb-3">
              {review.comment}
            </SafeText>

            {review.images && review.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {review.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 w-full rounded overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, 100px"
                    />
                  </div>
                ))}
              </div>
            )}

            {review.ownerResponse && (
              <div className="mt-3 pt-3 border-t bg-muted/50 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary">
                    Owner Response
                  </span>
                  {review.ownerResponseDate && (
                    <span className="text-xs text-muted-foreground">
                      {format(
                        new Date(review.ownerResponseDate),
                        'MMM dd, yyyy'
                      )}
                    </span>
                  )}
                </div>
                <SafeText as="p" className="text-sm text-foreground">
                  {review.ownerResponse}
                </SafeText>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
