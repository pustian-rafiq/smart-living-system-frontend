'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import type { AttendanceRecord } from '@/types/attendance'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

interface AttendanceCalendarProps {
  records: AttendanceRecord[]
  onDateClick?: (date: string) => void
  studentId?: string
}

const statusColors = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  late: 'bg-yellow-500',
  excused: 'bg-blue-500',
  meal_attended: 'bg-green-600',
  meal_absent: 'bg-orange-500',
}

export function AttendanceCalendar({
  records,
  onDateClick,
  studentId,
}: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get records for the current month
  const monthRecords = useMemo(() => {
    const monthStr = format(currentMonth, 'yyyy-MM')
    return records.filter(r => r.date.startsWith(monthStr))
  }, [records, currentMonth])

  // Group records by date
  const recordsByDate = useMemo(() => {
    const grouped: Record<string, AttendanceRecord[]> = {}
    monthRecords.forEach(record => {
      if (!studentId || record.studentId === studentId) {
        if (!grouped[record.date]) {
          grouped[record.date] = []
        }
        grouped[record.date].push(record)
      }
    })
    return grouped
  }, [monthRecords, studentId])

  const getStatusForDate = (date: string): AttendanceRecord['status'] | null => {
    const dayRecords = recordsByDate[date]
    if (!dayRecords || dayRecords.length === 0) return null

    // If multiple records, prioritize present > late > excused > absent
    if (dayRecords.some(r => r.status === 'present')) return 'present'
    if (dayRecords.some(r => r.status === 'late')) return 'late'
    if (dayRecords.some(r => r.status === 'excused')) return 'excused'
    if (dayRecords.some(r => r.status === 'absent')) return 'absent'
    return dayRecords[0].status
  }

  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(format(date, 'yyyy-MM-dd'))
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  // Get first day of month to determine offset
  const firstDayOfWeek = monthStart.getDay()
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Attendance Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {format(currentMonth, 'MMMM yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month start */}
            {Array.from({ length: firstDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const status = getStatusForDate(dateStr)
              const isToday = isSameDay(day, new Date())

              return (
                <button
                  key={dateStr}
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square rounded-md border p-1 text-xs transition-all
                    ${isToday ? 'border-primary bg-primary/10 font-bold' : 'border-border'}
                    ${status ? 'cursor-pointer hover:bg-muted' : 'opacity-50'}
                    ${onDateClick ? '' : 'cursor-default'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className={isToday ? 'text-primary' : ''}>
                      {format(day, 'd')}
                    </span>
                    {status && (
                      <div
                        className={`w-2 h-2 rounded-full mt-1 ${statusColors[status]}`}
                        title={status}
                      />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-4 border-t text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Excused</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
