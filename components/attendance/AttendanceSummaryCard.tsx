'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, Clock, UtensilsCrossed } from 'lucide-react'
import type { AttendanceSummary } from '@/types/attendance'
import { format } from 'date-fns'

interface AttendanceSummaryCardProps {
  summary: AttendanceSummary
}

export function AttendanceSummaryCard({ summary }: AttendanceSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{summary.studentName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(new Date(summary.period.startDate), 'MMM dd')} -{' '}
          {format(new Date(summary.period.endDate), 'MMM dd, yyyy')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Attendance Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Attendance Rate</span>
            <span className="font-semibold">{summary.attendanceRate.toFixed(1)}%</span>
          </div>
          <Progress value={summary.attendanceRate} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Present</span>
            </div>
            <p className="text-xl font-bold">{summary.presentDays}</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>Absent</span>
            </div>
            <p className="text-xl font-bold">{summary.absentDays}</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span>Late</span>
            </div>
            <p className="text-xl font-bold">{summary.lateDays}</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>Excused</span>
            </div>
            <p className="text-xl font-bold">{summary.excusedDays}</p>
          </div>
        </div>

        {/* Meal Attendance */}
        <div className="rounded-lg border p-3 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Meal Attendance</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Meal Attendance Rate</span>
              <span className="font-semibold">{summary.mealAttendanceRate.toFixed(1)}%</span>
            </div>
            <Progress value={summary.mealAttendanceRate} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <span>Attended: {summary.mealAttended}</span>
              <span>Absent: {summary.mealAbsent}</span>
            </div>
          </div>
        </div>

        {/* Total Days */}
        <div className="text-center pt-2 border-t">
          <p className="text-sm text-muted-foreground">Total Days</p>
          <p className="text-2xl font-bold">{summary.totalDays}</p>
        </div>
      </CardContent>
    </Card>
  )
}
