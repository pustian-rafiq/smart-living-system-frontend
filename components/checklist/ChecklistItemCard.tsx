'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Camera, DollarSign } from 'lucide-react'
import type { ChecklistItem } from '@/types/checklist'

interface ChecklistItemCardProps {
  item: ChecklistItem
  onEdit?: (item: ChecklistItem) => void
  onAddPhoto?: (item: ChecklistItem) => void
  showActions?: boolean
}

const statusColors = {
  good: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
  fair: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  poor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400',
  damaged:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
  missing:
    'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
}

const statusLabels = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  damaged: 'Damaged',
  missing: 'Missing',
}

export function ChecklistItemCard({
  item,
  onEdit,
  onAddPhoto,
  showActions = true,
}: ChecklistItemCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm md:text-base">
                  {item.name}
                </h3>
                <Badge
                  variant="outline"
                  className={`text-xs ${statusColors[item.status]}`}
                >
                  {statusLabels[item.status]}
                </Badge>
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              )}
              {item.notes && (
                <p className="text-xs text-muted-foreground mt-1">
                  {item.notes}
                </p>
              )}
              {item.damageDescription && (
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-xs font-medium text-red-800 dark:text-red-200">
                    Damage: {item.damageDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          {item.photos && item.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {item.photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                >
                  <img
                    src={photo}
                    alt={`${item.name} - Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Financial Info */}
          {(item.estimatedValue || item.repairCost) && (
            <div className="flex items-center justify-between pt-2 border-t text-sm">
              {item.estimatedValue && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Value: ৳{item.estimatedValue.toLocaleString()}</span>
                </div>
              )}
              {item.repairCost && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <DollarSign className="h-4 w-4" />
                  <span>Repair: ৳{item.repairCost.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2 border-t">
              {onAddPhoto && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onAddPhoto(item)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
