'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FaqItem } from '@/data/legalContent'

interface FaqListProps {
  items: FaqItem[]
  className?: string
}

export function FaqList({ items, className }: FaqListProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className={cn('space-y-2', className)}>
      {items.map(item => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            id={item.id}
            className="scroll-mt-24 overflow-hidden rounded-lg border border-border/80 bg-card"
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/50"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-foreground">{item.question}</span>
              <ChevronDown
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div className="border-t px-4 pb-4 pt-2 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface FaqFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export function FaqCategoryFilter({
  categories,
  active,
  onChange,
}: FaqFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            active === cat
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
