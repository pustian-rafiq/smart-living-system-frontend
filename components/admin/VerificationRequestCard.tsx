'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Eye, FileText } from 'lucide-react'
import type { VerificationRequest } from '@/types/admin'
import { format } from 'date-fns'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface VerificationRequestCardProps {
  request: VerificationRequest
  onApprove?: (requestId: string) => void
  onReject?: (requestId: string, reason: string) => void
}

export function VerificationRequestCard({
  request,
  onApprove,
  onReject,
}: VerificationRequestCardProps) {
  const statusColors: Record<VerificationRequest['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
  }

  const handleReject = () => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      onReject?.(request.id, reason)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{request.userName}</CardTitle>
            <p className="text-sm text-muted-foreground">{request.userEmail}</p>
            <p className="text-sm text-muted-foreground">{request.userPhone}</p>
          </div>
          <Badge className={statusColors[request.status]}>
            {request.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <Badge variant="outline" className="capitalize">
              {request.verificationType}
            </Badge>
          </div>
          {request.documentType && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document:</span>
              <span className="capitalize">{request.documentType}</span>
            </div>
          )}
          {request.documentNumber && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number:</span>
              <span className="font-mono text-xs">
                {request.documentNumber}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted:</span>
            <span>{format(new Date(request.submittedAt), 'MMM dd, yyyy')}</span>
          </div>
          {request.reviewedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reviewed:</span>
              <span>
                {format(new Date(request.reviewedAt), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
          {request.rejectionReason && (
            <div className="mt-2 rounded bg-red-50 p-2">
              <p className="text-xs font-semibold text-red-800">
                Rejection Reason:
              </p>
              <p className="text-xs text-red-700">{request.rejectionReason}</p>
            </div>
          )}
        </div>

        {request.documentImage && (
          <div className="mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Verification Document</DialogTitle>
                  <DialogDescription>
                    {request.documentType?.toUpperCase()} -{' '}
                    {request.documentNumber}
                  </DialogDescription>
                </DialogHeader>
                <div className="relative h-[500px] w-full">
                  <Image
                    src={request.documentImage}
                    alt="Verification document"
                    fill
                    className="object-contain"
                    sizes="800px"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {request.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onApprove?.(request.id)}
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReject}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
