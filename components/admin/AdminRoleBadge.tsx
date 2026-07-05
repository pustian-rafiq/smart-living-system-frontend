'use client'

import { Badge } from '@/components/ui/badge'
import { ADMIN_ROLE_LABELS } from '@/lib/admin/permissions'
import type { AdminRole } from '@/types/admin'
import { Shield } from 'lucide-react'

interface AdminRoleBadgeProps {
  role: AdminRole
  className?: string
}

const roleVariant: Record<
  AdminRole,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  'super-admin': 'default',
  moderator: 'secondary',
  support: 'outline',
}

export function AdminRoleBadge({ role, className }: AdminRoleBadgeProps) {
  return (
    <Badge variant={roleVariant[role]} className={className}>
      <Shield className="mr-1 h-3 w-3" />
      {ADMIN_ROLE_LABELS[role]}
    </Badge>
  )
}
