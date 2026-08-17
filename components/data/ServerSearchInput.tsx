'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SERVER_SEARCH_MIN_CHARS } from '@/lib/api/paging'

type ServerSearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minChars?: number
  className?: string
  pending?: boolean
}

export function ServerSearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  minChars = SERVER_SEARCH_MIN_CHARS,
  className,
  pending = false,
}: ServerSearchInputProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
          aria-describedby="server-search-hint"
        />
      </div>
      <p
        id="server-search-hint"
        className={cn(
          'text-xs text-muted-foreground',
          pending && 'text-amber-600',
        )}
      >
        {pending
          ? `Type at least ${minChars} characters to search`
          : `Search runs after ${minChars}+ characters`}
      </p>
    </div>
  )
}
