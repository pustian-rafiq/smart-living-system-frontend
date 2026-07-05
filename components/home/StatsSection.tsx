'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Users, MapPin, Star } from 'lucide-react'

const statItems = [
  { key: 'propertiesListed', icon: <Building2 className="h-8 w-8" />, value: '10,000+', color: 'from-blue-500 to-cyan-500' },
  { key: 'activeUsers', icon: <Users className="h-8 w-8" />, value: '50,000+', color: 'from-purple-500 to-pink-500' },
  { key: 'citiesCovered', icon: <MapPin className="h-8 w-8" />, value: '15+', color: 'from-green-500 to-emerald-500' },
  { key: 'userRating', icon: <Star className="h-8 w-8" />, value: '4.8/5', color: 'from-orange-500 to-red-500' },
] as const

export function StatsSection() {
  const t = useTranslations('home')

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {statItems.map(({ key, icon, value, color }) => (
            <Card
              key={key}
              className="group border-2 transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  {icon}
                </div>
                <div
                  className={`mb-2 text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent sm:text-4xl`}
                >
                  {value}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t(`stats.${key}`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
