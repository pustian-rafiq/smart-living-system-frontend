'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GitCompareArrows, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Property } from '@/types/property'

interface CompareBarProps {
  selected: Property[]
  onRemove: (id: string) => void
  onClear: () => void
}

export function CompareBar({ selected, onRemove, onClear }: CompareBarProps) {
  const router = useRouter()
  if (selected.length === 0) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 md:bottom-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border bg-background/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <GitCompareArrows className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            Compare ({selected.length}/3)
          </span>
          {selected.map(p => (
            <Badge key={p.id} variant="secondary" className="gap-1 pr-1">
              <span className="max-w-[120px] truncate">{p.name}</span>
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-muted"
                onClick={() => onRemove(p.id)}
                aria-label={`Remove ${p.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Button
            size="sm"
            disabled={selected.length < 2}
            onClick={() =>
              router.push(
                `/compare?ids=${selected.map(p => p.id).join(',')}`
              )
            }
          >
            Compare now
          </Button>
        </div>
      </div>
    </div>
  )
}
