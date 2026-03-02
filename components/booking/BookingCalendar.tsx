'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns'
import type { Booking } from '@/types/booking'

interface BookingCalendarProps {
  bookings: Booking[]
  propertyId?: string
  onDateClick?: (date: Date, bookings: Booking[]) => void
}

export function BookingCalendar({
  bookings,
  propertyId,
  onDateClick,
}: BookingCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month')

  // Filter bookings by property if specified
  const filteredBookings = useMemo(() => {
    if (propertyId) {
      return bookings.filter(b => b.propertyId === propertyId)
    }
    return bookings
  }, [bookings, propertyId])

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date): Booking[] => {
    return filteredBookings.filter((booking) => {
      if (!booking.moveInDate) return false
      const moveIn = new Date(booking.moveInDate)
      const moveOut = booking.moveOutDate ? new Date(booking.moveOutDate) : null

      if (moveOut) {
        return isWithinInterval(date, { start: moveIn, end: moveOut })
      } else if (booking.duration) {
        const endDate = new Date(moveIn)
        endDate.setMonth(endDate.getMonth() + booking.duration)
        return isWithinInterval(date, { start: moveIn, end: endDate })
      }
      return isSameDay(date, moveIn)
    })
  }

  // Get date modifiers for calendar
  const dateModifiers = useMemo(() => {
    const modifiers: Record<string, Date[]> = {
      booked: [],
      pending: [],
      approved: [],
    }

    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)
    const days = eachDayOfInterval({ start, end })

    days.forEach((day) => {
      const dayBookings = getBookingsForDate(day)
      dayBookings.forEach((booking) => {
        if (booking.status === 'approved' || booking.status === 'completed') {
          modifiers.booked.push(day)
        } else if (booking.status === 'pending') {
          modifiers.pending.push(day)
        }
      })
    })

    return modifiers
  }, [filteredBookings, selectedMonth])

  const dateModifierClassNames = {
    booked: 'bg-red-100 text-red-800 hover:bg-red-200',
    pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    approved: 'bg-green-100 text-green-800 hover:bg-green-200',
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dayBookings = getBookingsForDate(date)
      onDateClick?.(date, dayBookings)
    }
  }

  // Group bookings by month for list view
  const bookingsByMonth = useMemo(() => {
    const grouped: Record<string, Booking[]> = {}
    filteredBookings.forEach((booking) => {
      if (booking.moveInDate) {
        const monthKey = format(new Date(booking.moveInDate), 'yyyy-MM')
        if (!grouped[monthKey]) {
          grouped[monthKey] = []
        }
        grouped[monthKey].push(booking)
      }
    })
    return grouped
  }, [filteredBookings])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Booking Calendar</CardTitle>
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'month' | 'list')}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'month' ? (
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedMonth}
              onSelect={(date) => date && setSelectedMonth(date)}
              month={selectedMonth}
              onMonthChange={setSelectedMonth}
              modifiers={dateModifiers}
              modifierClassNames={dateModifierClassNames}
              onDayClick={handleDateSelect}
              className="rounded-md border"
            />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-100 border border-red-300" />
                <span>Booked/Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-yellow-100 border border-yellow-300" />
                <span>Pending</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(bookingsByMonth)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([monthKey, monthBookings]) => (
                <div key={monthKey} className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    {format(new Date(monthKey + '-01'), 'MMMM yyyy')}
                  </h3>
                  <div className="space-y-2">
                    {monthBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          if (booking.moveInDate) {
                            handleDateSelect(new Date(booking.moveInDate))
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{booking.propertyName}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.moveInDate &&
                                format(new Date(booking.moveInDate), 'MMM dd, yyyy')}
                              {booking.moveOutDate &&
                                ` - ${format(new Date(booking.moveOutDate), 'MMM dd, yyyy')}`}
                            </p>
                          </div>
                          <Badge
                            variant={
                              booking.status === 'approved'
                                ? 'default'
                                : booking.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
