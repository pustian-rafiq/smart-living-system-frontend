'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MessageSquare, ShoppingCart, Wifi } from 'lucide-react'
import type { OwnerSMSWallet } from '@/types/sms'
import { purchaseSMSCredits } from '@/lib/api/messDomain'
import { toast } from '@/lib/feedback/toast'

interface SMSWalletPanelProps {
  wallet: OwnerSMSWallet | null
  onUpdated: (wallet: OwnerSMSWallet) => void
}

export function SMSWalletPanel({ wallet, onUpdated }: SMSWalletPanelProps) {
  const [open, setOpen] = useState(false)
  const [buying, setBuying] = useState<string | null>(null)

  if (!wallet) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Loading SMS credits…
        </CardContent>
      </Card>
    )
  }

  const handleBuy = async (packageId: string) => {
    setBuying(packageId)
    try {
      const result = await purchaseSMSCredits(packageId)
      if (!result?.wallet) {
        toast.error('Could not purchase SMS credits. Try again.')
        return
      }
      onUpdated(result.wallet)
      toast.success(`Added ${result.credits} SMS credits`)
      setOpen(false)
    } finally {
      setBuying(null)
    }
  }

  return (
    <>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex flex-col gap-2 text-base sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              SMS Credits
            </span>
            <Badge variant="outline">{wallet.planName} plan</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-bold">{wallet.balance}</p>
              <p className="text-sm text-muted-foreground">
                credits left · ৳{wallet.unitPriceBdt.toFixed(2)} / SMS
              </p>
            </div>
            <Button onClick={() => setOpen(true)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy SMS
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
            <div>
              Monthly free: <strong>{wallet.monthlyFreeQuota}</strong>
            </div>
            <div>
              Used: <strong>{wallet.lifetimeUsed}</strong>
            </div>
            <div>
              Purchased: <strong>{wallet.lifetimePurchased}</strong>
            </div>
            <div>
              Period: <strong>{wallet.period}</strong>
            </div>
          </div>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Wifi className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Gateway: {wallet.gateway.label}
              {wallet.gateway.configured
                ? ' — owners use the platform BulkSMSBD account (no personal API keys).'
                : ' — not live yet; configure API .env BulkSMSBD keys.'}
            </span>
          </p>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buy SMS credits</DialogTitle>
            <DialogDescription>
              Extra credits are added to your wallet instantly. Delivery uses
              SmartBasa system SMS (BulkSMSBD).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {wallet.packages.map(pkg => (
              <div
                key={pkg.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{pkg.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {pkg.description}
                  </p>
                  <p className="mt-1 text-sm font-semibold">৳{pkg.price}</p>
                </div>
                <Button
                  size="sm"
                  disabled={buying === pkg.id}
                  onClick={() => void handleBuy(pkg.id)}
                >
                  {buying === pkg.id ? 'Buying…' : 'Buy'}
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
