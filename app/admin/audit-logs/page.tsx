'use client'

import { useState, useMemo } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuditLogTable } from '@/components/audit/AuditLogTable'
import { AuditLogCard } from '@/components/audit/AuditLogCard'
import { AuditLogDetailDialog } from '@/components/audit/AuditLogDetailDialog'
import { RollbackDialog } from '@/components/audit/RollbackDialog'
import { getAuditLogs, rollbackAuditLog } from '@/data/mockAuditLogs'
import type { AuditLog, AuditAction, AuditEntityType } from '@/types/audit'
import { Download, Filter, X } from 'lucide-react'

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAction, setSelectedAction] = useState<AuditAction | 'all'>('all')
  const [selectedEntityType, setSelectedEntityType] = useState<AuditEntityType | 'all'>('all')
  const [selectedUserRole, setSelectedUserRole] = useState<'renter' | 'owner' | 'admin' | 'all'>('all')
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isRollbackDialogOpen, setIsRollbackDialogOpen] = useState(false)
  const [rollbackLog, setRollbackLog] = useState<AuditLog | null>(null)

  // Get all audit logs with filters
  const filteredLogs = useMemo(() => {
    return getAuditLogs({
      search: searchQuery || undefined,
      action: selectedAction !== 'all' ? [selectedAction] : undefined,
      entityType: selectedEntityType !== 'all' ? [selectedEntityType] : undefined,
      userRole: selectedUserRole !== 'all' ? selectedUserRole : undefined,
    })
  }, [searchQuery, selectedAction, selectedEntityType, selectedUserRole])

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setIsDetailDialogOpen(true)
  }

  const handleRollback = (log: AuditLog) => {
    setRollbackLog(log)
    setIsRollbackDialogOpen(true)
  }

  const handleConfirmRollback = () => {
    if (rollbackLog) {
      const success = rollbackAuditLog(rollbackLog.id)
      if (success) {
        setIsRollbackDialogOpen(false)
        setRollbackLog(null)
        // In a real app, you would refresh the logs here
      }
    }
  }

  const hasActiveFilters =
    searchQuery ||
    selectedAction !== 'all' ||
    selectedEntityType !== 'all' ||
    selectedUserRole !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedAction('all')
    setSelectedEntityType('all')
    setSelectedUserRole('all')
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Audit Logs</h2>
          <p className="text-muted-foreground">
            Track all changes, who made them, and when they were made
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Filters</CardTitle>
                <CardDescription>Filter audit logs by various criteria</CardDescription>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select value={selectedAction} onValueChange={v => setSelectedAction(v as AuditAction | 'all')}>
                  <SelectTrigger id="action">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="verify">Verify</SelectItem>
                    <SelectItem value="unverify">Unverify</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="rollback">Rollback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entityType">Entity Type</Label>
                <Select
                  value={selectedEntityType}
                  onValueChange={v => setSelectedEntityType(v as AuditEntityType | 'all')}
                >
                  <SelectTrigger id="entityType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="bill">Bill</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                    <SelectItem value="dispute">Dispute</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="notice">Notice</SelectItem>
                    <SelectItem value="mess">Mess</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="room">Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userRole">User Role</Label>
                <Select
                  value={selectedUserRole}
                  onValueChange={v => setSelectedUserRole(v as 'renter' | 'owner' | 'admin' | 'all')}
                >
                  <SelectTrigger id="userRole">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="renter">Renter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Audit Logs ({filteredLogs.length})
                </CardTitle>
                <CardDescription>
                  Showing {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Tabs value={viewMode} onValueChange={v => setViewMode(v as 'table' | 'card')}>
                  <TabsList>
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="card">Card</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'table' ? (
              <AuditLogTable
                logs={filteredLogs}
                onViewDetails={handleViewDetails}
                onRollback={handleRollback}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLogs.map(log => (
                  <AuditLogCard
                    key={log.id}
                    log={log}
                    onViewDetails={handleViewDetails}
                    onRollback={handleRollback}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AuditLogDetailDialog
          log={selectedLog}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
        />
        <RollbackDialog
          log={rollbackLog}
          open={isRollbackDialogOpen}
          onOpenChange={setIsRollbackDialogOpen}
          onConfirm={handleConfirmRollback}
        />
      </div>
    </AdminLayout>
  )
}
