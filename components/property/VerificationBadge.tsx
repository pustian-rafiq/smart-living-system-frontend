'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { VerificationStatus } from '@/types/property'
import type { VerificationScore } from '@/types/living'
import { useTranslations } from 'next-intl'

interface VerificationBadgeProps {
  verified?: boolean
  verificationStatus?: VerificationStatus
  verifiedAt?: string
  showTooltip?: boolean
  verificationScore?: VerificationScore
}

export function VerificationBadge({
  verified,
  verificationStatus,
  verifiedAt,
  showTooltip = true,
  verificationScore,
}: VerificationBadgeProps) {
  const t = useTranslations('living.verification')
  const status: VerificationStatus =
    verificationStatus || (verified ? 'verified' : 'unverified')
  const score = verificationScore?.score
  const scoreLabel =
    score == null
      ? null
      : score >= 80
        ? t('smart', { score })
        : score >= 55
          ? t('partial', { score })
          : t('needs', { score })

  const badgeContent = (
    <Badge
      variant={status === 'verified' || (score != null && score >= 70) ? 'default' : 'secondary'}
      className={`${
        (score != null && score >= 80) || status === 'verified'
          ? 'bg-green-500 hover:bg-green-600'
          : (score != null && score >= 55) || status === 'pending'
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-gray-400 hover:bg-gray-500'
      } text-white border-0`}
    >
      {((score != null && score >= 80) || status === 'verified') && (
        <CheckCircle2 className="mr-1 h-3 w-3" />
      )}
      {status === 'pending' && score == null && <Clock className="mr-1 h-3 w-3" />}
      {status === 'unverified' && score == null && (
        <AlertCircle className="mr-1 h-3 w-3" />
      )}
      <span className="text-xs font-semibold">
        {scoreLabel
          ? scoreLabel
          : status === 'verified'
            ? 'Verified'
            : status === 'pending'
              ? 'Pending'
              : 'Unverified'}
      </span>
    </Badge>
  )

  if (!showTooltip) {
    return badgeContent
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">
              {verificationScore?.label || scoreLabel || 'Verification'}
            </p>
            {verificationScore?.breakdown?.slice(0, 6).map(item => (
              <p key={item.key} className="text-xs text-muted-foreground">
                {item.label}: {item.earned}/{item.max}
              </p>
            ))}
            {!verificationScore && status === 'verified' && verifiedAt && (
              <p className="text-xs text-muted-foreground">
                Verified on: {new Date(verifiedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
