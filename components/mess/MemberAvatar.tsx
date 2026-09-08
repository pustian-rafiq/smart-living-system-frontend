'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

type MemberAvatarProps = {
  name: string
  photoUrl?: string
  className?: string
}

/** Photos are optional, so initials are the normal case rather than a fallback. */
export function MemberAvatar({ name, photoUrl, className }: MemberAvatarProps) {
  return (
    <Avatar className={cn('h-10 w-10 border', className)}>
      {photoUrl ? <AvatarImage src={photoUrl} alt={name} /> : null}
      <AvatarFallback className="text-xs font-medium">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
