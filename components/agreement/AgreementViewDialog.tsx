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
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Calendar, FileText, DollarSign } from 'lucide-react'
import type { RentalAgreement } from '@/types/agreement'
import { format } from 'date-fns'
import { PRCATermsDisplay } from '@/components/agreement/PRCATermsDisplay'
import { SignaturePad } from '@/components/agreement/SignaturePad'
import type { PRCATerms } from '@/lib/api/documents'
import { getStoredRole } from '@/utils/auth'

interface AgreementViewDialogProps {
  agreement: RentalAgreement | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload?: (agreement: RentalAgreement) => void
  onSigned?: (agreement: RentalAgreement) => void
  onSign?: (
    agreementId: string,
    payload: { role: 'tenant' | 'owner'; signature: string; signedName: string },
  ) => Promise<RentalAgreement | null>
}

export function AgreementViewDialog({
  agreement,
  open,
  onOpenChange,
  onDownload,
  onSign,
  onSigned,
}: AgreementViewDialogProps) {
  const [signing, setSigning] = useState(false)
  if (!agreement) return null

  const role = getStoredRole()
  const signRole: 'tenant' | 'owner' =
    role === 'owner' || role === 'admin' ? 'owner' : 'tenant'
  const alreadySigned =
    signRole === 'owner'
      ? Boolean(agreement.ownerSignature)
      : Boolean(agreement.tenantSignature)

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
                {agreement.terms.prcaCompliant &&
                agreement.terms.templateName &&
                agreement.terms.provisions ? (
                  <PRCATermsDisplay
                    terms={
                      {
                        templateKey: agreement.terms.templateKey ?? '',
                        templateName: agreement.terms.templateName,
                        templateNameBn: agreement.terms.templateNameBn ?? '',
                        duration: agreement.terms.duration,
                        noticePeriod: agreement.terms.noticePeriod,
                        maxDepositMonths:
                          agreement.terms.maxDepositMonths ?? 2,
                        provisions: agreement.terms.provisions,
                        renewalTerms: agreement.terms.renewalTerms ?? '',
                        specialConditions:
                          agreement.terms.specialConditions ?? [],
                        warnings: agreement.terms.warnings ?? [],
                        landlordName: agreement.terms.landlordName ?? '',
                        tenantName: agreement.terms.tenantName ?? '',
                        propertyAddress:
                          agreement.terms.propertyAddress ?? '',
                        prcaCompliant: true,
                        generatedAt: agreement.terms.generatedAt ?? '',
                      } satisfies PRCATerms
                    }
                  />
                ) : (
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
                )}
              </div>
            )}

            {/* E-signature */}
            <div className="space-y-3">
              <h3 className="font-semibold">E-signature</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant={agreement.tenantSignature ? 'default' : 'outline'}>
                  Tenant: {agreement.tenantSignedName || 'Pending'}
                </Badge>
                <Badge variant={agreement.ownerSignature ? 'default' : 'outline'}>
                  Landlord: {agreement.ownerSignedName || 'Pending'}
                </Badge>
                {agreement.signatureStatus && (
                  <Badge variant="secondary">{agreement.signatureStatus}</Badge>
                )}
              </div>
              {onSign && !alreadySigned && (
                <SignaturePad
                  roleLabel={signRole === 'owner' ? 'landlord' : 'tenant'}
                  saving={signing}
                  onSave={async (signature, signedName) => {
                    setSigning(true)
                    try {
                      const updated = await onSign(agreement.id, {
                        role: signRole,
                        signature,
                        signedName,
                      })
                      if (updated) onSigned?.(updated)
                    } finally {
                      setSigning(false)
                    }
                  }}
                />
              )}
            </div>

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
