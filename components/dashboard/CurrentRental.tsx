'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, ArrowRight } from 'lucide-react'
import type { Flat, Building } from '@/types/building'

interface CurrentRentalProps {
  flat?: Flat
  building?: Building
}

export function CurrentRental({ flat, building }: CurrentRentalProps) {
  if (!flat) {
    return (
      <Card className="sm:col-span-2 lg:col-span-1 border-dashed">
        <CardContent className="pt-6 text-center">
          <Home className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm font-medium mb-1">No Active Rental</p>
          <p className="text-xs text-muted-foreground mb-4">
            Start searching for your perfect home
          </p>
          <Button asChild size="sm">
            <Link href="/search">Find Property</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sm:col-span-2 lg:col-span-1 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Home className="h-5 w-5 text-primary" />
          Current Rental
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Property</p>
          <p className="font-semibold">{building?.name || 'Property Name'}</p>
          <p className="text-xs text-muted-foreground">
            Flat {flat.flatNumber} • Floor {flat.floor}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Monthly Rent</p>
            <p className="text-xl font-bold text-primary">
              ৳{flat.rent.toLocaleString()}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/bills">
              View Bills
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
