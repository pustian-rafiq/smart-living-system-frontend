'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import { FEATURED_BOOST_OPTIONS } from '@/lib/monetization/boostOptions'
import { purchaseFeaturedBoost } from '@/lib/api/subscriptions'
import type { Property } from '@/types/property'

interface BoostListingDialogProps {
  listing: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function BoostListingDialog({
  listing,
  open,
  onOpenChange,
  onSuccess,
}: BoostListingDialogProps) {
  const [boostId, setBoostId] = useState(FEATURED_BOOST_OPTIONS[0].id)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [featuredUntil, setFeaturedUntil] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selected = FEATURED_BOOST_OPTIONS.find(b => b.id === boostId)

  const handlePurchase = async () => {
    if (!listing) return
    setLoading(true)
    setError(null)
    const result = await purchaseFeaturedBoost(listing.id, boostId)
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setFeaturedUntil(result.data.featuredUntil)
    setDone(true)
    onSuccess?.()
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setDone(false)
      setError(null)
      setFeaturedUntil(null)
    }
    onOpenChange(next)
  }

  if (!listing) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Boost listing
          </DialogTitle>
          <DialogDescription>
            {listing.name} — get a Featured badge and priority placement in
            search results.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <div>
              <p className="font-semibold">Listing boosted!</p>
              <p className="text-sm text-muted-foreground">
                Featured until {featuredUntil}
              </p>
            </div>
            <Button className="w-full" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <RadioGroup value={boostId} onValueChange={setBoostId}>
              {FEATURED_BOOST_OPTIONS.map(opt => (
                <div
                  key={opt.id}
                  className="flex items-start space-x-3 rounded-lg border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem value={opt.id} id={opt.id} className="mt-1" />
                  <Label htmlFor={opt.id} className="flex-1 cursor-pointer">
                    <span className="font-medium">{opt.label}</span>
                    <span className="ml-2 font-bold text-primary">
                      ৳{opt.price}
                    </span>
                    <p className="text-sm font-normal text-muted-foreground">
                      {opt.description}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              className="w-full"
              disabled={loading || !selected}
              onClick={handlePurchase}
            >
              {loading
                ? 'Processing…'
                : `Pay ৳${selected?.price.toLocaleString()} (demo)`}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo: no real payment. TODO: wire bKash / card for boosts.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
