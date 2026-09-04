'use client'

import { useState, useCallback } from 'react'
import { Search, Sparkles, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AISearchBarProps {
  onSearch: (query: string) => void
  loading?: boolean
  parsedQuery?: {
    area: string | null
    city: string | null
    type: string | null
    gender: string | null
    budgetMin: number | null
    budgetMax: number | null
    facilities: string[]
  } | null
}

const EXAMPLE_QUERIES = [
  'Mohammadpur-এ ১৫,০০০ টাকায় ২ বেডরুম, লিফট থাকতে হবে',
  'Dhanmondi mess for male students under 8000',
  'উত্তরায় ফ্যামিলি ফ্ল্যাট ২০,০০০ টাকার মধ্যে',
  'Apartment in Mirpur with parking and generator',
  'মেয়েদের মেস গুলশানে WiFi সহ',
]

export function AISearchBar({ onSearch, loading, parsedQuery }: AISearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) onSearch(query.trim())
    },
    [query, onSearch],
  )

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Sparkles className="absolute left-3 h-5 w-5 text-primary" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="বলুন আপনার কেমন বাসা দরকার... / Describe what you need..."
            className="h-12 pl-10 pr-24 text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-20 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            type="submit"
            disabled={!query.trim() || loading}
            className="absolute right-1.5 h-9"
          >
            {loading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-1.5 h-4 w-4" />
            )}
            {loading ? 'Matching...' : 'AI Match'}
          </Button>
        </div>
      </form>

      {/* Parsed query chips */}
      {parsedQuery && (
        <div className="flex flex-wrap gap-1.5">
          {parsedQuery.area && (
            <Badge variant="secondary">📍 {parsedQuery.area}</Badge>
          )}
          {parsedQuery.city && (
            <Badge variant="secondary">🏙️ {parsedQuery.city}</Badge>
          )}
          {parsedQuery.type && (
            <Badge variant="secondary">🏠 {parsedQuery.type}</Badge>
          )}
          {parsedQuery.gender && (
            <Badge variant="secondary">👤 {parsedQuery.gender}</Badge>
          )}
          {parsedQuery.budgetMin != null && (
            <Badge variant="secondary">
              💰 ৳{Math.round(parsedQuery.budgetMin).toLocaleString()}
              {parsedQuery.budgetMax
                ? ` – ৳${Math.round(parsedQuery.budgetMax).toLocaleString()}`
                : ''}
            </Badge>
          )}
          {parsedQuery.facilities.map(f => (
            <Badge key={f} variant="outline">
              ✓ {f}
            </Badge>
          ))}
        </div>
      )}

      {/* Example queries */}
      {!parsedQuery && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLE_QUERIES.slice(0, 3).map(eq => (
            <button
              key={eq}
              type="button"
              onClick={() => {
                setQuery(eq)
                onSearch(eq)
              }}
              className="rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {eq.length > 45 ? eq.slice(0, 45) + '…' : eq}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
