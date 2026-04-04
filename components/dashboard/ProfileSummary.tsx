'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Phone, Mail, User, Check } from 'lucide-react'

interface ProfileSummaryProps {
  name: string
  phone: string
  email?: string
  profileCompletion?: number
  showEditButton?: boolean
}

function VerificationBadge() {
  return (
    <Badge
      variant="outline"
      className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
    >
      <Check className="h-3.5 w-3.5 mr-1" />
      Verified
    </Badge>
  )
}

export function ProfileSummary({
  name,
  phone,
  email,
  profileCompletion,
  showEditButton = true,
}: ProfileSummaryProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="md:shadow-lg border-primary/20">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/20">
            <AvatarImage src={undefined} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg md:text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-xl md:text-2xl font-bold truncate">{name}</h2>
              <VerificationBadge />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{phone}</span>
              </div>
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{email}</span>
                </div>
              )}
            </div>
            {/* Profile Completion */}
            {profileCompletion !== undefined && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Profile Completion
                  </span>
                  <span className="font-medium">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </div>
            )}
          </div>
          {showEditButton && (
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
