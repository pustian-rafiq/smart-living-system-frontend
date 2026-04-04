'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Calendar, FileText, DollarSign } from 'lucide-react'
import type { RentalAgreement } from '@/types/agreement'
import { format } from 'date-fns'

interface AgreementViewDialogProps {
  agreement: RentalAgreement | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload?: (agreement: RentalAgreement) => void
}

export function AgreementViewDialog({
  agreement,
  open,
  onOpenChange,
  onDownload,
}: AgreementViewDialogProps) {
  if (!agreement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Rental Agreement Details
          </DialogTitle>
          <DialogDescription>
            {agreement.propertyName}{' '}
            {agreement.flatNumber && `- Flat ${agreement.flatNumber}`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  agreement.status === 'active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : agreement.status === 'expired'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                }
              >
                {agreement.status.charAt(0).toUpperCase() +
                  agreement.status.slice(1)}
              </Badge>
              <Badge variant="outline">{agreement.agreementType}</Badge>
            </div>

            {/* Agreement Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dates
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">
                      {format(new Date(agreement.startDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">
                      {format(new Date(agreement.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span className="font-medium">
                      {format(new Date(agreement.expiryDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Terms
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent:</span>
                    <span className="font-medium">
                      ৳{agreement.monthlyRent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Security Deposit:
                    </span>
                    <span className="font-medium">
                      ৳{agreement.securityDeposit.toLocaleString()}
                    </span>
                  </div>
                  {agreement.terms && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {agreement.terms.duration} months
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms */}
            {agreement.terms && (
              <div className="space-y-3">
                <h3 className="font-semibold">Terms & Conditions</h3>
                <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
                  {agreement.terms.noticePeriod && (
                    <div>
                      <p className="text-sm font-medium">Notice Period</p>
                      <p className="text-sm text-muted-foreground">
                        {agreement.terms.noticePeriod} days
                      </p>
                    </div>
                  )}
                  {agreement.terms.renewalTerms && (
                    <div>
                      <p className="text-sm font-medium">Renewal Terms</p>
                      <p className="text-sm text-muted-foreground">
                        {agreement.terms.renewalTerms}
                      </p>
                    </div>
                  )}
                  {agreement.terms.specialConditions &&
                    agreement.terms.specialConditions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Special Conditions
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {agreement.terms.specialConditions.map(
                            (condition, idx) => (
                              <li key={idx}>{condition}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Document Preview */}
            <div className="space-y-3">
              <h3 className="font-semibold">Document</h3>
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{agreement.documentName}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded{' '}
                        {format(new Date(agreement.uploadedAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  {onDownload && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(agreement)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
                {/* PDF Preview */}
                <div className="mt-4 rounded border bg-white dark:bg-gray-900 min-h-[400px] flex items-center justify-center">
                  <iframe
                    src={agreement.documentUrl}
                    className="w-full h-[400px] rounded"
                    title="Agreement Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
