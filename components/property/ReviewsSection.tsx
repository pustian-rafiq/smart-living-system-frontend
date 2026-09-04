'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ReviewCard } from '@/components/hotel/ReviewCard'
import { RatingDisplay } from '@/components/hotel/RatingDisplay'
import { Star, Loader2, MessageSquarePlus } from 'lucide-react'
import {
  REVIEW_CATEGORIES,
  type PropertyReview,
  type ReviewCategory,
  type ReviewFormData,
  type ReviewSummary,
} from '@/types/review'
import { cn } from '@/lib/utils'

interface ReviewsSectionProps {
  reviews: PropertyReview[]
  summary: ReviewSummary
  onSubmitReview?: (data: ReviewFormData) => Promise<void>
  canReview?: boolean
  className?: string
}

function StarPicker({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (n: number) => void
  label: string
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-sm">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            className="rounded p-0.5"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            aria-label={`${n} stars`}
          >
            <Star
              className={cn(
                'h-5 w-5',
                (hover || value) >= n
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function ReviewsSection({
  reviews,
  summary,
  onSubmitReview,
  canReview = true,
  className,
}: ReviewsSectionProps) {
  const t = useTranslations('living.reviews')
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [categories, setCategories] = useState<Record<ReviewCategory, number>>({
    cleanliness: 5,
    security: 5,
    ownerBehaviour: 5,
    location: 5,
    valueForMoney: 5,
  })
  const [comment, setComment] = useState('')
  const [stayMonths, setStayMonths] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const overallFromCats = useMemo(() => {
    const values = REVIEW_CATEGORIES.map(key => categories[key])
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }, [categories])

  const handleSubmit = async () => {
    if (!onSubmitReview) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmitReview({
        rating: overallFromCats || rating,
        comment,
        stayDurationMonths: stayMonths ? parseInt(stayMonths, 10) : undefined,
        ...categories,
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
          <h3 className="text-lg font-semibold">{t('title')}</h3>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        {canReview && onSubmitReview && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            {t('write')}
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
            {t('count', { count: summary.totalReviews })}
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

      {summary.categoryAverages && summary.totalReviews > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {REVIEW_CATEGORIES.map(key => {
            const value = summary.categoryAverages?.[key]
            if (value == null) return null
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="text-muted-foreground">
                  {t(`categories.${key}`)}
                </span>
                <RatingDisplay rating={value} size="sm" />
              </div>
            )
          })}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          {t('thanks')}
        </div>
      )}

      {showForm && (
        <div className="space-y-4 rounded-xl border p-4">
          <div className="space-y-3">
            {REVIEW_CATEGORIES.map(key => (
              <StarPicker
                key={key}
                label={t(`categories.${key}`)}
                value={categories[key]}
                onChange={n => {
                  setCategories(prev => ({ ...prev, [key]: n }))
                  setRating(overallFromCats)
                }}
              />
            ))}
          </div>
          <div>
            <Label htmlFor="review-comment">{t('experience')}</Label>
            <Textarea
              id="review-comment"
              className="mt-1.5"
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="stay-months">{t('stayMonths')}</Label>
            <Input
              id="stay-months"
              type="number"
              min={1}
              className="mt-1.5 max-w-[160px]"
              value={stayMonths}
              onChange={e => setStayMonths(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={submitting}
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-lg border border-dashed py-10 text-center">
          <p className="font-medium text-muted-foreground">{t('emptyTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('emptyDesc')}</p>
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
                  {t('verifiedStay')}
                </Badge>
              )}
              <ReviewCard review={review} />
              <div className="mt-1 flex flex-wrap gap-2 px-1 text-xs text-muted-foreground">
                {REVIEW_CATEGORIES.map(key => {
                  const value = review[key]
                  if (value == null) return null
                  return (
                    <span key={key}>
                      {t(`categories.${key}`)} {value}★
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
