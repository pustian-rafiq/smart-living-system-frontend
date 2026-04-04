'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Phone, Edit, Trash2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import type { FamilyMember } from '@/types/renterProfile'

interface FamilyMemberCardProps {
  member: FamilyMember
  onEdit: (member: FamilyMember) => void
  onDelete: (id: string) => void
}

export function FamilyMemberCard({
  member,
  onEdit,
  onDelete,
}: FamilyMemberCardProps) {
  const getRelationLabel = () => {
    switch (member.relation) {
      case 'spouse':
        return 'Spouse'
      case 'child':
        return 'Child'
      case 'parent':
        return 'Parent'
      case 'sibling':
        return 'Sibling'
      default:
        return 'Other'
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Photo */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border bg-muted">
            {member.photoUrl ? (
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold text-sm">{member.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {getRelationLabel()} • {member.age} years old •{' '}
                  {member.gender}
                </p>
              </div>
              {member.isEmergencyContact && (
                <Badge variant="secondary" className="text-xs">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Emergency
                </Badge>
              )}
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              {member.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{member.phone}</span>
                </div>
              )}
              {member.nid && (
                <div>
                  <span>NID: {member.nid}</span>
                </div>
              )}
              <div>
                <span>
                  Added: {format(new Date(member.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(member)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(member.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
