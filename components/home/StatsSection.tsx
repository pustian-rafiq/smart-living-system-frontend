'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Building2, Users, MapPin, Star } from 'lucide-react'

const stats = [
  {
    icon: <Building2 className="h-8 w-8" />,
    value: '10,000+',
    label: 'Properties Listed',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Users className="h-8 w-8" />,
    value: '50,000+',
    label: 'Active Users',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    value: '15+',
    label: 'Cities Covered',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Star className="h-8 w-8" />,
    value: '4.8/5',
    label: 'User Rating',
    color: 'from-orange-500 to-red-500',
  },
]

export function StatsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group border-2 transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`mb-2 text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent sm:text-4xl`}
                >
                  {stat.value}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
