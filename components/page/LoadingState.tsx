import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ListPageSkeleton } from './ListPageSkeleton'

export function LoadingState({
  label = 'Loading…',
  className,
  variant = 'spinner',
  skeletonCount = 6,
  skeletonVariant = 'card',
}: {
  label?: string
  className?: string
  variant?: 'spinner' | 'skeleton'
  skeletonCount?: number
  skeletonVariant?: 'card' | 'row' | 'table'
}) {
  if (variant === 'skeleton') {
    return (
      <div role="status" aria-live="polite" aria-label={label} className={className}>
        <p className="sr-only">{label}</p>
        <ListPageSkeleton count={skeletonCount} variant={skeletonVariant} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border bg-muted/20 py-12',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
