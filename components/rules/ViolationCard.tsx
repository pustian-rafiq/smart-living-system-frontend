'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, User, Calendar, DollarSign } from 'lucide-react'
import type { RuleViolation } from '@/types/messRules'
import { format } from 'date-fns'

interface ViolationCardProps {
  violation: RuleViolation
  onResolve?: (violation: RuleViolation) => void
  showActions?: boolean
}

const severityColors = {
  minor: 'bg-blue-50 text-blue-700 border-blue-200',
  moderate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  major: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
}

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  resolved: 'bg-green-50 text-green-700 border-green-200',
  appealed: 'bg-blue-50 text-blue-700 border-blue-200',
  dismissed: 'bg-gray-50 text-gray-700 border-gray-200',
}

export function ViolationCard({
  violation,
  onResolve,
  showActions = true,
}: ViolationCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {violation.ruleTitle}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={`text-xs ${severityColors[violation.severity]}`}>
                {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
              </Badge>
              <Badge variant="outline" className={`text-xs ${statusColors[violation.status]}`}>
                {violation.status.charAt(0).toUpperCase() + violation.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Student Info */}
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{violation.studentName}</span>
        </div>

        {/* Violation Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Violation Date:</span>
          <span className="font-medium">
            {format(new Date(violation.violationDate), 'MMM dd, yyyy')}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">{violation.description}</p>

        {/* Penalty */}
        {violation.penalty && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-red-600" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Penalty: {violation.penalty.type.charAt(0).toUpperCase() + violation.penalty.type.slice(1)}
              </p>
            </div>
            {violation.penalty.amount && (
              <p className="text-sm text-red-700 dark:text-red-300">
                Amount: ৳{violation.penalty.amount.toLocaleString()}
              </p>
            )}
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {violation.penalty.description}
            </p>
          </div>
        )}

        {/* Resolution Notes */}
        {violation.status === 'resolved' && violation.resolutionNotes && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">
              Resolution:
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              {violation.resolutionNotes}
            </p>
            {violation.resolvedAt && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Resolved: {format(new Date(violation.resolvedAt), 'MMM dd, yyyy')}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && violation.status === 'pending' && onResolve && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onResolve(violation)}
          >
            Resolve Violation
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
