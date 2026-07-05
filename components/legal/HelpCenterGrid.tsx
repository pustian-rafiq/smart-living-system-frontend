'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Rocket,
  User,
  CreditCard,
  CalendarCheck,
  Building2,
  Shield,
} from 'lucide-react'
import type { HelpCategory } from '@/data/legalContent'
import { cn } from '@/lib/utils'

const iconMap = {
  start: Rocket,
  account: User,
  payment: CreditCard,
  booking: CalendarCheck,
  owner: Building2,
  safety: Shield,
}

interface HelpCenterGridProps {
  categories: HelpCategory[]
  className?: string
}

export function HelpCenterGrid({ categories, className }: HelpCenterGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {categories.map(cat => {
        const Icon = iconMap[cat.icon]
        return (
          <Card
            key={cat.id}
            className="border-border/80 transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{cat.title}</CardTitle>
              <CardDescription>{cat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cat.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary hover:underline"
                    >
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
