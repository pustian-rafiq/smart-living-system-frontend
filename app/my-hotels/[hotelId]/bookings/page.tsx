'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Users, Phone, Mail, Check, X } from 'lucide-react'
import { mockHotels, getBookingsByHotelId } from '@/data/mockHotels'
import { format } from 'date-fns'
import type { Booking, BookingStatus } from '@/types/hotel'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function BookingManagementPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.hotelId as string

  const hotel = mockHotels.find(h => h.id === hotelId)
  const allBookings = hotel ? getBookingsByHotelId(hotelId) : []

  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')

  const bookings = useMemo(() => {
    let filtered = [...allBookings]
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [statusFilter, allBookings])

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    if (confirm(`Change booking status to ${newStatus}?`)) {
      // TODO: Implement status update
      alert('Booking status updated')
    }
  }

  const statusColors: Record<BookingStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    'checked-in': 'bg-purple-100 text-purple-800',
    'checked-out': 'bg-gray-100 text-gray-800',
  }

  if (!hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold text-muted-foreground">Hotel not found</p>
              <Button variant="outline" onClick={() => router.push('/my-hotels')} className="mt-4">
                Back to Hotels
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-2">
            ← Back
          </Button>
          <h1 className="text-2xl font-bold mb-2">Booking Management</h1>
          <p className="text-muted-foreground">{hotel.name}</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings Table */}
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold text-muted-foreground">
                No bookings found
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {statusFilter === 'all' 
                  ? 'No bookings yet'
                  : `No ${statusFilter} bookings`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">
                          {booking.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.guestName}</p>
                            <p className="text-xs text-muted-foreground">{booking.guestPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>Room {booking.roomId}</TableCell>
                        <TableCell>
                          {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell className="font-semibold">
                          ৳{booking.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[booking.status]}>
                            {booking.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(booking.id, 'checked-in')}
                              >
                                Check In
                              </Button>
                            )}
                            {booking.status === 'checked-in' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(booking.id, 'checked-out')}
                              >
                                Check Out
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
