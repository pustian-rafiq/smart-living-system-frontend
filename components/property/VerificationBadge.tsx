'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { VerificationStatus } from '@/types/property'

interface VerificationBadgeProps {
  verified?: boolean
  verificationStatus?: VerificationStatus
  verifiedAt?: string
  showTooltip?: boolean
}

export function VerificationBadge({
  verified,
  verificationStatus,
  verifiedAt,
  showTooltip = true,
}: VerificationBadgeProps) {
  // Determine status
  const status: VerificationStatus = verificationStatus || (verified ? 'verified' : 'unverified')

  const badgeContent = (
    <Badge
      variant={status === 'verified' ? 'default' : 'secondary'}
      className={`${
        status === 'verified'
          ? 'bg-green-500 hover:bg-green-600'
          : status === 'pending'
          ? 'bg-yellow-500 hover:bg-yellow-600'
          : 'bg-gray-400 hover:bg-gray-500'
      } text-white border-0`}
    >
      {status === 'verified' && <CheckCircle2 className="mr-1 h-3 w-3" />}
      {status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
      {status === 'unverified' && <AlertCircle className="mr-1 h-3 w-3" />}
      <span className="text-xs font-semibold">
        {status === 'verified'
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
              {status === 'verified'
                ? 'Verified Listing'
                : status === 'pending'
                ? 'Verification Pending'
                : 'Unverified Listing'}
            </p>
            {status === 'verified' && (
              <>
                <p className="text-xs text-muted-foreground">
                  This property has been verified by our team. Verification includes:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Owner identity verification</li>
                  <li>Property ownership documents</li>
                  <li>Property photos verification</li>
                  <li>Address and location confirmation</li>
                </ul>
                {verifiedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Verified on: {new Date(verifiedAt).toLocaleDateString()}
                  </p>
                )}
              </>
            )}
            {status === 'pending' && (
              <p className="text-xs text-muted-foreground">
                This property is currently under verification review. Verification typically takes 24-48 hours.
              </p>
            )}
            {status === 'unverified' && (
              <p className="text-xs text-muted-foreground">
                This property has not been verified yet. We recommend contacting the owner directly for more information.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
