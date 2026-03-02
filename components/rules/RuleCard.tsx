'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle2, XCircle, FileText } from 'lucide-react'
import type { MessRule } from '@/types/messRules'
import { format } from 'date-fns'

interface RuleCardProps {
  rule: MessRule
  isAccepted?: boolean
  onAccept?: (rule: MessRule) => void
  onView?: (rule: MessRule) => void
  showActions?: boolean
}

const severityColors = {
  minor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  moderate: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  major: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400',
  critical: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
}

const categoryLabels = {
  general: 'General',
  payment: 'Payment',
  attendance: 'Attendance',
  meal: 'Meal',
  behavior: 'Behavior',
  facility: 'Facility',
  other: 'Other',
}

export function RuleCard({
  rule,
  isAccepted,
  onAccept,
  onView,
  showActions = true,
}: RuleCardProps) {
  return (
    <Card className={`transition-all hover:shadow-md ${!isAccepted && rule.requiresAcceptance ? 'border-yellow-500' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {rule.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {categoryLabels[rule.category]}
              </Badge>
              <Badge variant="outline" className={`text-xs ${severityColors[rule.severity]}`}>
                {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
              </Badge>
              {isAccepted && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Accepted
                </Badge>
              )}
              {!isAccepted && rule.requiresAcceptance && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Pending Acceptance
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground">{rule.description}</p>

        {/* Penalty */}
        {rule.penalty && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Penalty: {rule.penalty}
              </p>
            </div>
          </div>
        )}

        {/* Effective Date */}
        {rule.effectiveDate && (
          <div className="text-xs text-muted-foreground">
            Effective from: {format(new Date(rule.effectiveDate), 'MMM dd, yyyy')}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2 border-t">
            {!isAccepted && rule.requiresAcceptance && onAccept && (
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => onAccept(rule)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Accept Rule
              </Button>
            )}
            {onView && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onView(rule)}
              >
                View Details
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
