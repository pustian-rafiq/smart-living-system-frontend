'use client'

import { useCallback, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  fetchUserVerificationStatus,
  submitVerificationRequest,
} from '@/lib/api/userVerification'
import { setVerificationStatus } from '@/utils/auth'
import type { LucideIcon } from 'lucide-react'
import {
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  AlertCircle,
} from 'lucide-react'
import type { UserVerificationStatus } from '@/types/userVerification'

const statusConfig: Record<
  UserVerificationStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: LucideIcon }
> = {
  unverified: { label: 'Not verified', variant: 'outline', icon: AlertCircle },
  pending: { label: 'Under review', variant: 'secondary', icon: Clock },
  verified: { label: 'Verified', variant: 'default', icon: CheckCircle2 },
  rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
}

export function UserVerificationPanel() {
  const [tick, setTick] = useState(0)
  const [verificationType, setVerificationType] = useState<'nid' | 'document'>(
    'nid'
  )
  const [documentNumber, setDocumentNumber] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const load = useCallback(() => fetchUserVerificationStatus(), [tick])
  const { data, loading, refetch } = useMockQuery(load)

  const status = data?.status ?? 'unverified'
  const config = statusConfig[status]
  const StatusIcon = config.icon
  const canSubmit = status === 'unverified' || status === 'rejected'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    const result = await submitVerificationRequest({
      verificationType,
      documentNumber: documentNumber.trim() || undefined,
      documentFileName: fileName || undefined,
    })

    setSubmitting(false)
    if (!result.ok) {
      setSubmitError(result.error)
      return
    }

    setVerificationStatus(result.data.status)
    setSubmitSuccess(true)
    setTick(t => t + 1)
    refetch()
  }

  return (
    <Card className="border-border/80">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Identity verification
            </CardTitle>
            <CardDescription className="mt-1">
              Verified profiles build trust for bookings, mess seats, and rent
              agreements.
            </CardDescription>
          </div>
          <Badge variant={config.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading status…</p>
        )}

        {status === 'verified' && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
            <CheckCircle2 className="mb-2 h-5 w-5" />
            Your identity is verified. A badge appears on your profile and
            builds renter/owner trust.
          </div>
        )}

        {status === 'pending' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40">
            <Clock className="mb-2 h-5 w-5 text-amber-600" />
            Your documents are being reviewed. This usually takes 1–2 business
            days.
            {data?.request?.submittedAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Submitted{' '}
                {new Date(data.request.submittedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {status === 'rejected' && data?.request?.rejectionReason && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="font-medium text-destructive">Previous request rejected</p>
            <p className="mt-1 text-muted-foreground">
              {data.request.rejectionReason}
            </p>
            <p className="mt-2 text-xs">You can submit again with clearer documents.</p>
          </div>
        )}

        {canSubmit && (
          <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label>Document type</Label>
              <Select
                value={verificationType}
                onValueChange={v => setVerificationType(v as 'nid' | 'document')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nid">National ID (NID)</SelectItem>
                  <SelectItem value="document">Passport / other ID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-number">
                {verificationType === 'nid' ? 'NID number' : 'Document number'}
              </Label>
              <Input
                id="doc-number"
                placeholder={
                  verificationType === 'nid' ? '1234567890123' : 'Document ID'
                }
                value={documentNumber}
                onChange={e => setDocumentNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Photo of document</Label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 hover:bg-muted/50">
                <Upload className="mb-2 h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {fileName || 'Upload clear photo (demo: filename only)'}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={e =>
                    setFileName(e.target.files?.[0]?.name ?? null)
                  }
                />
              </label>
            </div>

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-sm text-emerald-600">
                Submitted! We will notify you when review is complete.
              </p>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit for verification'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
