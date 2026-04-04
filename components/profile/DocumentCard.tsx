'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  Download,
  Trash2,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import type { Document } from '@/types/renterProfile'

interface DocumentCardProps {
  document: Document
  onView: (document: Document) => void
  onDelete: (id: string) => void
}

export function DocumentCard({
  document,
  onView,
  onDelete,
}: DocumentCardProps) {
  const [showViewer, setShowViewer] = useState(false)

  const getStatusBadge = () => {
    switch (document.verificationStatus) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case 'expired':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  const getDocumentTypeLabel = () => {
    switch (document.type) {
      case 'nid':
        return 'NID'
      case 'passport':
        return 'Passport'
      case 'driving_license':
        return 'Driving License'
      default:
        return 'Other'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const isExpired =
    document.expiryDate && new Date(document.expiryDate) < new Date()

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Document Preview */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
              {document.fileUrl ? (
                <Image
                  src={document.fileUrl}
                  alt={document.fileName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {getDocumentTypeLabel()}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {document.fileName}
                  </p>
                </div>
                {getStatusBadge()}
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Number:</span>
                  <span className="font-medium">{document.documentNumber}</span>
                </div>
                {document.expiryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Expires:{' '}
                      {format(new Date(document.expiryDate), 'MMM dd, yyyy')}
                      {isExpired && (
                        <span className="text-red-500 ml-1">(Expired)</span>
                      )}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>Size: {formatFileSize(document.fileSize)}</span>
                  <span>•</span>
                  <span>
                    Uploaded:{' '}
                    {format(new Date(document.uploadedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                {document.verificationStatus === 'verified' &&
                  document.verifiedAt && (
                    <div className="text-green-600">
                      Verified:{' '}
                      {format(new Date(document.verifiedAt), 'MMM dd, yyyy')}
                    </div>
                  )}
                {document.verificationStatus === 'rejected' &&
                  document.rejectionReason && (
                    <div className="text-red-600">
                      Reason: {document.rejectionReason}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowViewer(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const link = document.createElement('a')
                link.href = document.fileUrl
                link.download = document.fileName
                link.click()
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(document.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Viewer Dialog */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {getDocumentTypeLabel()} - {document.documentNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[70vh] bg-muted rounded-lg overflow-hidden">
            <Image
              src={document.fileUrl}
              alt={document.fileName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
