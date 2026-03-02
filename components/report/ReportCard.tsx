'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar, CheckCircle2 } from 'lucide-react'
import type { ExpenseReport, TaxDocument } from '@/types/report'
import { format } from 'date-fns'

interface ReportCardProps {
  report?: ExpenseReport
  taxDocument?: TaxDocument
  onDownload?: (report: ExpenseReport | TaxDocument) => void
}

export function ReportCard({ report, taxDocument, onDownload }: ReportCardProps) {
  const data = report || taxDocument
  if (!data) return null

  const isTaxDocument = !!taxDocument

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <FileText className="h-5 w-5 text-primary" />
              {isTaxDocument
                ? taxDocument.documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                : report?.reportType.charAt(0).toUpperCase() + report?.reportType.slice(1) + ' Report'}
            </CardTitle>
            {isTaxDocument && (
              <p className="text-sm text-muted-foreground mt-1">Tax Year: {taxDocument.taxYear}</p>
            )}
          </div>
          {isTaxDocument && taxDocument.verified && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Period */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Period:</span>
          <span className="font-medium">
            {format(new Date(data.period.startDate), 'MMM dd, yyyy')} -{' '}
            {format(new Date(data.period.endDate), 'MMM dd, yyyy')}
          </span>
        </div>

        {/* Amount */}
        {isTaxDocument ? (
          <div>
            <p className="text-2xl font-bold text-primary">
              ৳{taxDocument.totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Amount</p>
          </div>
        ) : (
          report && (
            <div>
              <p className="text-2xl font-bold text-primary">
                ৳{report.data.totalExpenses.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Expenses</p>
            </div>
          )
        )}

        {/* Breakdown Preview */}
        {isTaxDocument && taxDocument.breakdown.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Breakdown:</p>
            <div className="space-y-1">
              {taxDocument.breakdown.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="font-medium">৳{item.amount.toLocaleString()}</span>
                </div>
              ))}
              {taxDocument.breakdown.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{taxDocument.breakdown.length - 3} more items
                </p>
              )}
            </div>
          </div>
        )}

        {!isTaxDocument && report && report.data.categoryBreakdown.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Top Categories:</p>
            <div className="space-y-1">
              {report.data.categoryBreakdown.slice(0, 3).map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{cat.categoryName}</span>
                  <span className="font-medium">৳{cat.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Info */}
        <div className="rounded-lg border p-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {data.fileName || `${isTaxDocument ? 'tax' : 'expense'}-report.${data.format}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Generated {format(new Date(data.generatedAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <Badge variant="outline" className="ml-2">
              {data.format.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onDownload && onDownload(data)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardContent>
    </Card>
  )
}
