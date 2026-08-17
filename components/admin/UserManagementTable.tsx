'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MoreVertical,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  ShieldCheck,
  UserX,
  UserCheck,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { UserManagement, UserStatus } from '@/types/admin'
import { format } from 'date-fns'

interface UserManagementTableProps {
  users: UserManagement[]
  loading?: boolean
  onStatusChange?: (userId: string, status: UserStatus) => void
  onVerify?: (userId: string) => void
  onViewDetails?: (userId: string) => void
  canBan?: boolean
  canManage?: boolean
  busyUserId?: string | null
}

/** Defer action so Radix dropdown fully closes before confirm/dialog opens. */
function runAfterMenuClose(action: () => void) {
  window.setTimeout(action, 50)
}

export function UserManagementTable({
  users,
  loading = false,
  onStatusChange,
  onVerify,
  onViewDetails,
  canBan = true,
  canManage = true,
  busyUserId = null,
}: UserManagementTableProps) {
  const statusColors: Record<UserStatus, string> = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    banned: 'bg-red-100 text-red-800',
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-muted-foreground"
              >
                {loading ? 'Loading users…' : 'No users found'}
              </TableCell>
            </TableRow>
          ) : (
            users.map(user => {
              const busy = busyUserId === user.id
              return (
                <TableRow
                  key={user.id}
                  className={busy ? 'opacity-60' : undefined}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email || '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[user.status]}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>Properties: {user.totalProperties ?? 0}</p>
                      <p>Bookings: {user.totalBookings ?? 0}</p>
                      <p>Score: {user.activityScore ?? 0}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={busy}
                          aria-label={`Actions for ${user.name}`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() =>
                            runAfterMenuClose(() => onViewDetails?.(user.id))
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        {canManage && !user.verified && (
                          <DropdownMenuItem
                            onSelect={() =>
                              runAfterMenuClose(() => onVerify?.(user.id))
                            }
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Verify User
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        {canManage && user.status === 'active' && (
                          <DropdownMenuItem
                            onSelect={() =>
                              runAfterMenuClose(() =>
                                onStatusChange?.(user.id, 'suspended'),
                              )
                            }
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        )}

                        {canManage && user.status === 'suspended' && (
                          <DropdownMenuItem
                            onSelect={() =>
                              runAfterMenuClose(() =>
                                onStatusChange?.(user.id, 'active'),
                              )
                            }
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate User
                          </DropdownMenuItem>
                        )}

                        {canBan && user.status === 'banned' && (
                          <DropdownMenuItem
                            onSelect={() =>
                              runAfterMenuClose(() =>
                                onStatusChange?.(user.id, 'active'),
                              )
                            }
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Unban User
                          </DropdownMenuItem>
                        )}

                        {canBan && user.status !== 'banned' && (
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onSelect={() =>
                              runAfterMenuClose(() =>
                                onStatusChange?.(user.id, 'banned'),
                              )
                            }
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
