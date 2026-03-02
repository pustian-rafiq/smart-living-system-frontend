'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChecklistItemCard } from './ChecklistItemCard'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Checklist } from '@/types/checklist'
import { format } from 'date-fns'

interface ChecklistViewDialogProps {
  checklist: Checklist | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChecklistViewDialog({
  checklist,
  open,
  onOpenChange,
}: ChecklistViewDialogProps) {
  if (!checklist) return null

  const itemsByCategory = checklist.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof checklist.items>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {checklist.type === 'move_in' ? 'Move-in' : 'Move-out'} Checklist
          </DialogTitle>
          <DialogDescription>
            {checklist.propertyName} {checklist.flatNumber && `- Flat ${checklist.flatNumber}`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Status and Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{checklist.items.length}</p>
                  </div>
                </CardContent>
              </Card>
              {checklist.totalEstimatedValue && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold">৳{checklist.totalEstimatedValue.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {checklist.totalRepairCost && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Repair Cost</p>
                      <p className="text-2xl font-bold text-red-600">
                        ৳{checklist.totalRepairCost.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Security Deposit Info (for move-out) */}
            {checklist.type === 'move_out' && (
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Security Deposit
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Deposit Amount</p>
                        <p className="font-semibold">৳{checklist.securityDepositAmount.toLocaleString()}</p>
                      </div>
                      {checklist.securityDepositReturned !== undefined && (
                        <div>
                          <p className="text-muted-foreground">Returned</p>
                          <p className="font-semibold text-green-600">
                            ৳{checklist.securityDepositReturned.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    {checklist.securityDepositDeductions && checklist.securityDepositDeductions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Deductions:</p>
                        {checklist.securityDepositDeductions.map((deduction, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg border p-2 bg-muted/30"
                          >
                            <div>
                              <p className="text-sm font-medium">{deduction.itemName}</p>
                              <p className="text-xs text-muted-foreground">{deduction.reason}</p>
                            </div>
                            <p className="text-sm font-semibold text-red-600">
                              -৳{deduction.amount.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {checklist.securityDepositReturnDate && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Returned on: {format(new Date(checklist.securityDepositReturnDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Photos */}
            {checklist.photos && checklist.photos.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Property Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {checklist.photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={photo}
                        alt={`Property photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Items by Category */}
            <div className="space-y-4">
              <h3 className="font-semibold">Items by Category</h3>
              {Object.entries(itemsByCategory).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map(item => (
                      <ChecklistItemCard key={item.id} item={item} showActions={false} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            {checklist.notes && (
              <div className="rounded-lg border p-4 bg-muted/30">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{checklist.notes}</p>
              </div>
            )}

            {/* Status and Approval */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-sm font-medium">
                  {format(new Date(checklist.completedAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  checklist.status === 'approved'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : checklist.status === 'completed'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }
              >
                {checklist.status.charAt(0).toUpperCase() + checklist.status.slice(1)}
              </Badge>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
