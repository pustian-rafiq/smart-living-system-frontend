'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  Home,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'
import type { Flat, Renter, Payment } from '@/types/building'
import { RenterHistoryDialog } from '@/components/renter/RenterHistoryDialog'
import { cn } from '@/lib/utils'

interface FlatDetailDialogProps {
  flat: Flat | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignRenter: (flat: Flat) => void
  onGenerateBill: (flat: Flat) => void
}

const statusConfig = {
  available: {
    label: 'Available',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  },
  occupied: {
    label: 'Occupied',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  },
  maintenance: {
    label: 'Maintenance',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  },
}

// Mock payment history
const mockPayments: Payment[] = [
  {
    id: 'p1',
    flatId: 'f1',
    amount: 12000,
    month: 'January',
    year: 2024,
    status: 'paid',
    paidDate: '2024-01-05',
    dueDate: '2024-01-01',
  },
  {
    id: 'p2',
    flatId: 'f1',
    amount: 12000,
    month: 'February',
    year: 2024,
    status: 'paid',
    paidDate: '2024-02-03',
    dueDate: '2024-02-01',
  },
  {
    id: 'p3',
    flatId: 'f1',
    amount: 12000,
    month: 'March',
    year: 2024,
    status: 'pending',
    dueDate: '2024-03-01',
  },
]

const paymentStatusConfig = {
  paid: {
    icon: CheckCircle2,
    className: 'text-green-600 dark:text-green-400',
    label: 'Paid',
  },
  pending: {
    icon: Clock,
    className: 'text-yellow-600 dark:text-yellow-400',
    label: 'Pending',
  },
  overdue: {
    icon: XCircle,
    className: 'text-red-600 dark:text-red-400',
    label: 'Overdue',
  },
}

export function FlatDetailDialog({
  flat,
  open,
  onOpenChange,
  onAssignRenter,
  onGenerateBill,
}: FlatDetailDialogProps) {
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)

  if (!flat) return null

  const status = statusConfig[flat.status]
  const flatPayments = mockPayments.filter(p => p.flatId === flat.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Flat {flat.flatNumber}
          </DialogTitle>
          <DialogDescription>Floor {flat.floor}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Rent */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge variant="outline" className={cn('text-sm', status.className)}>
              {status.label}
            </Badge>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Rent</p>
              <p className="text-2xl font-bold text-primary">
                ৳{flat.rent.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Flat Details */}
          {(flat.area || flat.bedrooms || flat.bathrooms) && (
            <div className="grid grid-cols-3 gap-4">
              {flat.area && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="text-lg font-semibold">{flat.area} sqft</p>
                </div>
              )}
              {flat.bedrooms && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="text-lg font-semibold">{flat.bedrooms}</p>
                </div>
              )}
              {flat.bathrooms && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p className="text-lg font-semibold">{flat.bathrooms}</p>
                </div>
              )}
            </div>
          )}

          {/* Renter Information */}
          {flat.renter ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Renter Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{flat.renter.name}</p>
                      <p className="text-sm text-muted-foreground">Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{flat.renter.phone}</p>
                      <p className="text-sm text-muted-foreground">Phone</p>
                    </div>
                  </div>
                  {flat.renter.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{flat.renter.email}</p>
                        <p className="text-sm text-muted-foreground">Email</p>
                      </div>
                    </div>
                  )}
                  {flat.renter.nid && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{flat.renter.nid}</p>
                        <p className="text-sm text-muted-foreground">NID</p>
                      </div>
                    </div>
                  )}
                  {flat.renter.address && (
                    <div className="flex items-start gap-3">
                      <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{flat.renter.address}</p>
                        <p className="text-sm text-muted-foreground">Address</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {new Date(flat.renter.joinedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Joined Date</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsHistoryDialogOpen(true)}
                >
                  View Full History
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <User className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No renter assigned</p>
                <Button onClick={() => onAssignRenter(flat)}>
                  Assign Renter
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Payment History</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGenerateBill(flat)}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Generate Bill
              </Button>
            </CardHeader>
            <CardContent>
              {flatPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Paid Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flatPayments.map((payment) => {
                        const statusInfo = paymentStatusConfig[payment.status]
                        const StatusIcon = statusInfo.icon
                        return (
                          <TableRow key={payment.id}>
                            <TableCell>
                              {payment.month} {payment.year}
                            </TableCell>
                            <TableCell className="font-medium">
                              ৳{payment.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(payment.dueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {payment.paidDate
                                ? new Date(payment.paidDate).toLocaleDateString()
                                : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <StatusIcon
                                  className={cn('h-4 w-4', statusInfo.className)}
                                />
                                <span>{statusInfo.label}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  No payment history available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {!flat.renter && (
              <Button className="flex-1" onClick={() => onAssignRenter(flat)}>
                Assign Renter
              </Button>
            )}
            {flat.renter && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onGenerateBill(flat)}
              >
                Generate Bill
              </Button>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Renter History Dialog */}
      {flat.renter && (
        <RenterHistoryDialog
          renterId={flat.renter.id}
          renterName={flat.renter.name}
          open={isHistoryDialogOpen}
          onOpenChange={setIsHistoryDialogOpen}
        />
      )}
    </Dialog>
  )
}
