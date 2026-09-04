'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2, Scale } from 'lucide-react'
import type { PRCATerms } from '@/lib/api/documents'

export function PRCATermsDisplay({ terms }: { terms: PRCATerms }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">{terms.templateName}</h4>
        </div>
        {terms.prcaCompliant && (
          <Badge className="bg-emerald-500 text-white">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            PRCA Compliant
          </Badge>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{terms.templateNameBn}</p>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg border p-2">
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="font-semibold">{terms.duration} months</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-xs text-muted-foreground">Notice Period</p>
          <p className="font-semibold">{terms.noticePeriod} days</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-xs text-muted-foreground">Max Deposit</p>
          <p className="font-semibold">{terms.maxDepositMonths} months</p>
        </div>
      </div>

      {terms.warnings.length > 0 && (
        <div className="space-y-1.5">
          {terms.warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {w}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Legal Provisions (PRCA 1991)
        </h5>
        {terms.provisions.map(p => (
          <Card key={p.key} className="border-border/50">
            <CardContent className="p-3">
              <p className="text-xs font-semibold">
                {p.title}
                <span className="ml-1 font-normal text-muted-foreground">
                  — {p.section}
                </span>
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {p.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {terms.receiptObligation && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
          <p className="font-semibold">Rent receipt (Section 23)</p>
          <p className="mt-1">{terms.receiptObligation}</p>
        </div>
      )}

      {terms.stampDuty && (
        <div className="rounded-lg border p-3 text-xs">
          <p className="font-semibold">Stamp duty / registration guidance</p>
          <p className="mt-1 text-muted-foreground">
            {terms.stampDuty.requiresRegistration
              ? `Likely requires registration. Indicative stamp duty ≈ ৳${terms.stampDuty.indicativeStampDutyAmount.toLocaleString()} (${(
                  terms.stampDuty.indicativeStampDutyRate * 100
                ).toFixed(0)}% of annual rent).`
              : 'Typically no full registration for ≤12 month tenancies — confirm with a lawyer.'}
          </p>
        </div>
      )}

      {terms.rentIncreaseRules && (
        <div className="rounded-lg border p-3 text-xs">
          <p className="font-semibold">Rent increase rules</p>
          <p className="mt-1 text-muted-foreground">
            {terms.rentIncreaseRules.summary}
          </p>
        </div>
      )}

      {terms.renewalTerms && (
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-semibold">Renewal Terms</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {terms.renewalTerms}
          </p>
        </div>
      )}

      {terms.specialConditions.length > 0 && (
        <div>
          <p className="text-xs font-semibold">Special Conditions</p>
          <ul className="mt-1 list-inside list-disc text-[11px] text-muted-foreground">
            {terms.specialConditions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
