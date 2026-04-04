'use client'

import { useState, useMemo } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Check, X, Eye } from 'lucide-react'
import { mockComplaints } from '@/data/mockComplaints'
import type { ComplaintStatus } from '@/types/complaint'
import { format } from 'date-fns'
import Image from 'next/image'

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState(mockComplaints)
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>(
    'all'
  )
  const [searchTerm, setSearchTerm] = useState('')

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.userName.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [complaints, statusFilter, searchTerm])

  const handleStatusChange = (
    complaintId: string,
    newStatus: ComplaintStatus
  ) => {
    if (confirm(`Change complaint status to ${newStatus}?`)) {
      setComplaints(
        complaints.map(c =>
          c.id === complaintId
            ? {
                ...c,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                resolvedAt:
                  newStatus === 'resolved'
                    ? new Date().toISOString()
                    : undefined,
              }
            : c
        )
      )
      // TODO: API call
      alert('Complaint status updated')
    }
  }

  const statusColors: Record<ComplaintStatus, string> = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Complaint Management</h2>
          <p className="text-muted-foreground">
            Manage and resolve user complaints
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={value => setStatusFilter(value as any)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map(complaint => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      By {complaint.userName} •{' '}
                      {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge className={statusColors[complaint.status]}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground">{complaint.description}</p>

                {complaint.imageUrl && (
                  <div className="mb-4 relative h-48 w-full rounded overflow-hidden bg-muted">
                    <Image
                      src={complaint.imageUrl}
                      alt={complaint.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 800px"
                    />
                  </div>
                )}

                {complaint.response && (
                  <div className="mb-4 rounded bg-muted p-3">
                    <p className="text-sm font-semibold mb-1">Response:</p>
                    <p className="text-sm text-foreground">
                      {complaint.response}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {complaint.status === 'open' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(complaint.id, 'in_progress')
                        }
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(complaint.id, 'resolved')
                        }
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                  {complaint.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusChange(complaint.id, 'resolved')
                      }
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Resolve
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No complaints found matching your filters
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
