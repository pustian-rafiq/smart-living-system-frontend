'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ReviewCard } from '@/components/hotel/ReviewCard'
import { RatingDisplay } from '@/components/hotel/RatingDisplay'
import { Star, Loader2, MessageSquarePlus } from 'lucide-react'
import type { PropertyReview, ReviewSummary } from '@/types/review'
import { cn } from '@/lib/utils'

interface ReviewsSectionProps {
  reviews: PropertyReview[]
  summary: ReviewSummary
  onSubmitReview?: (data: {
    rating: number
    comment: string
    stayDurationMonths?: number
  }) => Promise<void>
  canReview?: boolean
  className?: string
}

export function ReviewsSection({
  reviews,
  summary,
  onSubmitReview,
  canReview = true,
  className,
}: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [stayMonths, setStayMonths] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!onSubmitReview) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmitReview({
        rating,
        comment,
        stayDurationMonths: stayMonths ? parseInt(stayMonths, 10) : undefined,
      })
      setSuccess(true)
      setShowForm(false)
      setComment('')
      setStayMonths('')
      setRating(5)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const maxDist = Math.max(...Object.values(summary.distribution), 1)

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Reviews & ratings</h3>
          <p className="text-sm text-muted-foreground">
            Real feedback from renters in Bangladesh
          </p>
        </div>
        {canReview && onSubmitReview && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Write a review
          </Button>
        )}
      </div>

      <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-[auto_1fr] sm:gap-8">
        <div className="flex flex-col items-center justify-center gap-1 px-4">
          <p className="text-4xl font-bold">
            {summary.totalReviews > 0 ? summary.averageRating.toFixed(1) : '—'}
          </p>
          <RatingDisplay
            rating={summary.averageRating}
            showNumber={false}
            size="md"
          />
          <p className="text-sm text-muted-foreground">
            {summary.totalReviews} review{summary.totalReviews === 1 ? '' : 's'}
          </p>
        </div>
        <div className="space-y-2">
          {([5, 4, 3, 2, 1] as const).map(star => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-8">{star}★</span>
              <Progress
                value={(summary.distribution[star] / maxDist) * 100}
                className="h-2 flex-1"
              />
              <span className="w-6 text-right text-muted-foreground">
                {summary.distribution[star]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          Thank you! Your review helps others find safe housing.
        </div>
      )}

      {showForm && (
        <div className="space-y-4 rounded-xl border p-4">
          <div>
            <Label className="mb-2 block">Your rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  className="rounded p-1 transition hover:scale-110"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                  aria-label={`${n} stars`}
                >
                  <Star
                    className={cn(
                      'h-7 w-7',
                      (hoverRating || rating) >= n
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="review-comment">Your experience</Label>
            <Textarea
              id="review-comment"
              className="mt-1.5"
              rows={4}
              placeholder="Share cleanliness, safety, owner behaviour, meals, billing transparency…"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="stay-months">How long did you stay? (months)</Label>
            <Input
              id="stay-months"
              type="number"
              min={1}
              className="mt-1.5 max-w-[160px]"
              value={stayMonths}
              onChange={e => setStayMonths(e.target.value)}
              placeholder="e.g. 6"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                'Submit review'
              )}
            </Button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-lg border border-dashed py-10 text-center">
          <p className="font-medium text-muted-foreground">No reviews yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to share your experience
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="relative">
              {review.verifiedStay && (
                <Badge
                  variant="secondary"
                  className="absolute right-3 top-3 z-10 text-xs"
                >
                  Verified stay
                </Badge>
              )}
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
