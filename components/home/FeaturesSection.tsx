'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Home,
  Building2,
  Hotel,
  Users,
  Shield,
  DollarSign,
  MessageCircle,
  MapPin,
} from 'lucide-react'

const features = [
  {
    icon: <Home className="h-6 w-6" />,
    title: 'Find Accommodation',
    description:
      'Search mess, hostel, hotel & apartments by city, area, price, and amenities.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: 'Apartment Management',
    description:
      'Manage flats, renters, bills, and notices all in one dashboard.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Hotel className="h-6 w-6" />,
    title: 'Hotel & Guest House',
    description:
      'Book short-term stays with daily pricing and instant booking.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Mess & Hostel',
    description:
      'Find verified mess with meal plans, seat types, and student-friendly pricing.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Verified & Trusted',
    description:
      'All listings verified with NID, documents, and background checks.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Easy Payments',
    description:
      'Pay with bKash, Nagad, Rocket, or cash. Auto-receipts and tracking.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: 'In-App Chat',
    description:
      'Communicate directly with owners. Real-time messaging and file sharing.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Location Based',
    description:
      'Google Maps integration. Find properties near you with distance calculation.',
    color: 'from-rose-500 to-pink-500',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Everything You Need in One Platform
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From finding your perfect space to managing rent and bills - we've
            got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />

              <CardHeader>
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
