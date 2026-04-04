'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  GraduationCap,
  Briefcase,
  Building2,
  Hotel,
  Users,
  Home,
} from 'lucide-react'

const userTypes = [
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: 'Students',
    description:
      'Find verified mess and hostels near your university. Meal plans, seat types, and student-friendly pricing.',
    features: [
      'Mess & Hostel Search',
      'Meal Plans',
      'Student Discounts',
      'Campus Proximity',
    ],
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: 'Job Holders',
    description:
      'Discover apartments and shared spaces. Transparent pricing, verified owners, and easy booking.',
    features: [
      'Apartment Listings',
      'Shared Spaces',
      'Verified Owners',
      'Quick Booking',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: 'Property Owners',
    description:
      'Manage your properties, renters, and bills efficiently. Automated reminders and payment tracking.',
    features: [
      'Property Management',
      'Bill Generation',
      'Renter Tracking',
      'Payment Reminders',
    ],
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Hotel className="h-6 w-6" />,
    title: 'Hotel Managers',
    description:
      'Manage room inventory, bookings, and pricing. Daily rates, calendar view, and online payments.',
    features: [
      'Room Management',
      'Booking Calendar',
      'Dynamic Pricing',
      'Online Payments',
    ],
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Mess Owners',
    description:
      'Manage seats, meals, and students. Menu upload, attendance tracking, and bulk notifications.',
    features: [
      'Seat Management',
      'Meal Scheduling',
      'Student Tracking',
      'Bulk SMS',
    ],
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: <Home className="h-6 w-6" />,
    title: 'Renters',
    description:
      'Track your rent, bills, and payments. View notices, submit complaints, and manage your tenancy.',
    features: [
      'Bill Tracking',
      'Payment History',
      'Notice Board',
      'Maintenance Requests',
    ],
    color: 'from-rose-500 to-pink-500',
  },
]

export function TargetUsersSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Built for Everyone
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Whether you're a student, job holder, property owner, or hotel
            manager - we have solutions for you.
          </p>
        </div>

        {/* User Types Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userTypes.map((user, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-xl"
            >
              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${user.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />

              <CardHeader>
                <div
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${user.color} text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  {user.icon}
                </div>
                <CardTitle className="text-2xl">{user.title}</CardTitle>
                <CardDescription className="text-base">
                  {user.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {user.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div
                        className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${user.color}`}
                      />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
