'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore, isAfter, startOfDay } from 'date-fns'
import type { Booking } from '@/types/hotel'

interface BookingCalendarProps {
  bookings: Booking[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  checkIn?: Date
  checkOut?: Date
  onCheckInSelect?: (date: Date) => void
  onCheckOutSelect?: (date: Date) => void
  roomId?: string
}

export function BookingCalendar({ 
  bookings, 
  selectedDate,
  onDateSelect,
  checkIn,
  checkOut,
  onCheckInSelect,
  onCheckOutSelect,
  roomId 
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get bookings for the current room
  const roomBookings = useMemo(() => {
    if (!roomId) return bookings
    return bookings.filter(b => b.roomId === roomId && b.status !== 'cancelled')
  }, [bookings, roomId])

  // Check if a date is booked
  const isDateBooked = (date: Date): boolean => {
    return roomBookings.some(booking => {
      const checkInDate = startOfDay(new Date(booking.checkIn))
      const checkOutDate = startOfDay(new Date(booking.checkOut))
      const currentDate = startOfDay(date)
      
      return (isAfter(currentDate, checkInDate) || isSameDay(currentDate, checkInDate)) &&
             (isBefore(currentDate, checkOutDate) || isSameDay(currentDate, checkOutDate))
    })
  }

  // Check if date is in selected range
  const isInRange = (date: Date): boolean => {
    if (!checkIn || !checkOut) return false
    const dateStart = startOfDay(date)
    const checkInStart = startOfDay(checkIn)
    const checkOutStart = startOfDay(checkOut)
    
    return (isAfter(dateStart, checkInStart) || isSameDay(dateStart, checkInStart)) &&
           (isBefore(dateStart, checkOutStart) || isSameDay(dateStart, checkOutStart))
  }

  const handleDateClick = (date: Date) => {
    if (isDateBooked(date)) return
    
    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onCheckInSelect?.(date)
    } else if (checkIn && !checkOut) {
      // Select check-out
      if (isBefore(date, checkIn)) {
        // If clicked date is before check-in, make it the new check-in
        onCheckInSelect?.(date)
      } else {
        onCheckOutSelect?.(date)
      }
    }
    
    onDateSelect?.(date)
  }

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Get first day of month offset
  const firstDayOffset = monthStart.getDay()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Dates</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month start */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map(day => {
            const isBooked = isDateBooked(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isCheckIn = checkIn && isSameDay(day, checkIn)
            const isCheckOut = checkOut && isSameDay(day, checkOut)
            const inRange = isInRange(day)
            const isToday = isSameDay(day, new Date())
            const isPast = isBefore(day, startOfDay(new Date()))

            return (
              <button
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                disabled={isBooked || isPast}
                className={`
                  aspect-square rounded-md text-sm transition-colors
                  ${isPast ? 'text-muted-foreground/50 cursor-not-allowed' : ''}
                  ${isBooked ? 'bg-red-100 text-red-600 cursor-not-allowed' : ''}
                  ${isCheckIn ? 'bg-primary text-primary-foreground font-semibold' : ''}
                  ${isCheckOut ? 'bg-primary text-primary-foreground font-semibold' : ''}
                  ${inRange && !isCheckIn && !isCheckOut ? 'bg-primary/20' : ''}
                  ${isSelected && !isCheckIn && !isCheckOut ? 'ring-2 ring-primary' : ''}
                  ${isToday && !isCheckIn && !isCheckOut ? 'ring-1 ring-primary' : ''}
                  ${!isBooked && !isPast && !isCheckIn && !isCheckOut ? 'hover:bg-muted' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-primary" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-primary/20" />
            <span>In Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-red-100" />
            <span>Booked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
