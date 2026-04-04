'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Clock, Edit } from 'lucide-react'
import type { AttendanceRecord } from '@/types/attendance'
import { format } from 'date-fns'

interface AttendanceTableProps {
  records: AttendanceRecord[]
  onEdit?: (record: AttendanceRecord) => void
  showStudentName?: boolean
}

const statusConfig = {
  present: {
    label: 'Present',
    className:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
  },
  absent: {
    label: 'Absent',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
  },
  late: {
    label: 'Late',
    className:
      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  excused: {
    label: 'Excused',
    className:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  },
  meal_attended: {
    label: 'Meal Attended',
    className:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
  },
  meal_absent: {
    label: 'Meal Absent',
    className:
      'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400',
  },
}

export function AttendanceTable({
  records,
  onEdit,
  showStudentName = false,
}: AttendanceTableProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No attendance records found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {showStudentName && <TableHead>Student</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                {showStudentName && onEdit && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map(record => {
                const status = statusConfig[record.status]

                return (
                  <TableRow key={record.id}>
                    {showStudentName && (
                      <TableCell className="font-medium">
                        {record.studentName}
                      </TableCell>
                    )}
                    <TableCell>
                      {format(new Date(record.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {record.type === 'general'
                          ? 'General'
                          : record.type === 'meal'
                            ? 'Meal'
                            : 'Both'}
                      </Badge>
                      {record.mealCategory && (
                        <span className="ml-2 text-xs text-muted-foreground capitalize">
                          ({record.mealCategory})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.checkInTime ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {format(new Date(record.checkInTime), 'HH:mm')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {format(new Date(record.checkOutTime), 'HH:mm')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    {showStudentName && onEdit && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
