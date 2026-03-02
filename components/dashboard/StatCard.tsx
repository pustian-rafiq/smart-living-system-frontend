'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  className?: string
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md md:shadow-sm ${className || ''}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground md:text-sm">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold md:text-3xl">
            {value}
          </p>
        </div>
        <div className="rounded-xl bg-muted p-2 md:p-3">
          <div className="h-5 w-5 md:h-6 md:w-6">
            {icon}
          </div>
        </div>
      </CardHeader>
      <div className="h-1 bg-gradient-to-r from-primary/70 via-primary/60 to-primary/60" />
    </Card>
  )
}
