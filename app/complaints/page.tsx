'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { ComplaintCard } from '@/components/complaint/ComplaintCard'
import { ComplaintForm } from '@/components/complaint/ComplaintForm'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, Plus } from 'lucide-react'
import { mockComplaints } from '@/data/mockComplaints'
import type { Complaint, ComplaintStatus } from '@/types/complaint'
import { getStoredRole } from '@/utils/auth'

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(mockComplaints)
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>(
    'all'
  )
  const [showForm, setShowForm] = useState(false)

  // Get user role (in real app, get from auth context)
  const userRole = getStoredRole() || 'renter'
  const isOwner = userRole === 'owner'

  // Filter complaints based on status
  const filteredComplaints = useMemo(() => {
    let filtered = [...complaints]

    // Filter by role (in real app, filter by logged-in user ID)
    if (!isOwner) {
      filtered = filtered.filter(c => c.userId === 'r1') // Mock: show complaints for first user
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [complaints, statusFilter, isOwner])

  const handleSubmit = (data: any) => {
    // TODO: Implement actual complaint submission
    const newComplaint: Complaint = {
      id: `c${Date.now()}`,
      userId: 'r1', // In real app, get from auth
      userName: 'Current User', // In real app, get from auth
      title: data.title,
      description: data.description,
      status: 'open',
      imageUrl: data.image ? URL.createObjectURL(data.image) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setComplaints([newComplaint, ...complaints])
    setShowForm(false)
    alert('Complaint submitted successfully!')
  }

  const statusCounts = {
    all: filteredComplaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Complaints</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isOwner
                ? 'Manage and track all complaints'
                : 'Submit and track your complaints'}
            </p>
          </div>
          {!isOwner && (
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? 'Cancel' : 'New Complaint'}
            </Button>
          )}
        </div>

        {/* Complaint Form */}
        {!isOwner && showForm && (
          <div className="mb-6">
            <ComplaintForm onSubmit={handleSubmit} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by Status:</span>
          </div>
          <Select
            value={statusFilter}
            onValueChange={value =>
              setStatusFilter(value as ComplaintStatus | 'all')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="open">Open ({statusCounts.open})</SelectItem>
              <SelectItem value="in_progress">
                In Progress ({statusCounts.in_progress})
              </SelectItem>
              <SelectItem value="resolved">
                Resolved ({statusCounts.resolved})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              No complaints found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {statusFilter !== 'all'
                ? `No complaints with status "${statusFilter}"`
                : !isOwner
                  ? 'Submit your first complaint to get started'
                  : 'No complaints yet'}
            </p>
            {!isOwner && !showForm && (
              <Button onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                New Complaint
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
