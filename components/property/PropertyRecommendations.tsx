'use client'

import { PropertyCard } from '@/components/property/PropertyCard'
import type { Property } from '@/types/property'

interface PropertyRecommendationsProps {
  properties: Property[]
  onViewDetails: (property: Property) => void
  onCall: (phone: string) => void
  title?: string
}

export function PropertyRecommendations({
  properties,
  onViewDetails,
  onCall,
  title = 'Similar places you may like',
}: PropertyRecommendationsProps) {
  if (!properties.length) return null

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Based on location, type, and rent range
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            onViewDetails={onViewDetails}
            onCall={onCall}
          />
        ))}
      </div>
    </section>
  )
}
