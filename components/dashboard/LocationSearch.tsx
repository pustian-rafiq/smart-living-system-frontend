'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LocationSearchProps {
  city: string
  area: string
  search: string
  onCityChange: (city: string) => void
  onAreaChange: (area: string) => void
  onSearchChange: (search: string) => void
  areasByCity: Record<string, string[]>
}

function Icon({
  path,
  className = 'h-6 w-6',
}: {
  path: string
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

export function LocationSearch({
  city,
  area,
  search,
  onCityChange,
  onAreaChange,
  onSearchChange,
  areasByCity,
}: LocationSearchProps) {
  return (
    <Card className="md:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Location & Search</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Pick your city and area to get better results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Location selectors */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="city" className="text-sm md:text-base">
              City
            </Label>
            <Select value={city} onValueChange={onCityChange}>
              <SelectTrigger id="city" className="h-10 md:h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(areasByCity).map(c => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="area" className="text-sm md:text-base">
              Area
            </Label>
            <Select value={area} onValueChange={onAreaChange}>
              <SelectTrigger id="area" className="h-10 md:h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(areasByCity[city] || []).map(a => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="search" className="text-sm md:text-base">
              Search
            </Label>
            <div className="relative">
              <Icon
                path="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
              />
              <Input
                id="search"
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search mess/apartment, road, landmark..."
                className="pl-10 h-10 md:h-11"
              />
            </div>
          </div>
        </div>

        {/* Search buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/search">Explore All</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link
              href={`/search?city=${encodeURIComponent(city)}&area=${encodeURIComponent(area)}&q=${encodeURIComponent(search)}`}
            >
              Search Now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
