'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin, Edit, Trash2, Star } from 'lucide-react'
import type { EmergencyContact } from '@/types/renterProfile'

interface EmergencyContactCardProps {
  contact: EmergencyContact
  onEdit: (contact: EmergencyContact) => void
  onDelete: (id: string) => void
}

export function EmergencyContactCard({
  contact,
  onEdit,
  onDelete,
}: EmergencyContactCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{contact.name}</h4>
              {contact.isPrimary && (
                <Badge variant="default" className="bg-yellow-500">
                  <Star className="mr-1 h-3 w-3" />
                  Primary
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{contact.relation}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span>{contact.phone}</span>
          </div>
          {contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span>{contact.email}</span>
            </div>
          )}
          {contact.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{contact.address}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(contact)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(contact.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
